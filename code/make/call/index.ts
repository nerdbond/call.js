import loveCode from '@wavebond/love-code'
import makeEachParser from './parser'
import makeEachType from './type'
import { BaseType } from '~/code/form/base'
import { ExtendPermitType } from '~/code/form/permit/extend'
import { PermitBuilderMapType, PermitType } from '~/code/form/permit'
import { toPascalCase } from '~/code/tool/helper'

export default async function make({
  base,
  name,
  source,
}: {
  base: BaseType
  name: string
  source: PermitBuilderMapType
}) {
  const schema = base[name]

  const callList: Array<{
    name: string
    call: PermitType
  }> = []

  const indexTypeList: Array<string> = []
  const indexParserList: Array<string> = []

  for (const action in source) {
    const builder = source[action]

    if (typeof builder !== 'function') {
      continue
    }

    const call = builder()
    callList.push({ name: action, call })

    switch (action) {
      case 'extend':
      case 'select':
      case 'create':
      case 'update':
      case 'remove':
        const titleAction = toPascalCase(action)
        const titleObject = toPascalCase(name)

        indexTypeList.push(
          `${titleAction}Type as ${titleObject}${titleAction}Type`,
        )
        indexParserList.push(
          `${titleAction} as ${titleObject}${titleAction}`,
        )
    }
  }

  const parserTextList = makeEachParser({
    base,
    schema,
    list: callList,
  })
  const typeTextList = makeEachType({
    base,
    schema,
    list: callList,
  })

  const indexList: Array<string> = []
  indexList.push(
    `export { ${indexTypeList.join(', ')} } from './${name}'`,
  )
  indexList.push(
    `export { ${indexParserList.join(', ')} } from './${name}/parser'`,
  )

  const index = await loveCode(indexList.join('\n'))
  const parser = await loveCode(parserTextList.join('\n'))
  const type = await loveCode(typeTextList.join('\n'))

  return { parser, type, index }
}
