import loveCode from '@wavebond/love-code'
import makeEachLoad from './load'
import makeEachType from './form'
import { BaseCast } from '~/code/cast/base'
import { HaveMoldMeshCast, HaveCast } from '~/code/form/hold'
import { toPascalCase } from '~/code/tool'

export default async function make({
  base,
  name,
  hold,
}: {
  base: BaseCast
  name: string
  hold: HaveMoldMeshCast
}) {
  const form = base[name]

  const callList: Array<{
    name: string
    call: HaveCast
  }> = []

  const indexTypeList: Array<string> = []
  const indexParserList: Array<string> = []

  for (const task in hold) {
    const Mold = hold[task]

    if (typeof Mold !== 'function') {
      continue
    }

    const call = Mold()
    callList.push({ name: task, call })

    switch (task) {
      case 'extend':
      case 'select':
      case 'create':
      case 'update':
      case 'remove':
        const titleAction = toPascalCase(task)
        const titleObject = toPascalCase(name)

        indexTypeList.push(
          `${titleAction}Type as ${titleObject}${titleAction}Type`,
        )
        indexParserList.push(
          `${titleAction} as ${titleObject}${titleAction}`,
        )
    }
  }

  const parserTextList = makeEachLoad({
    base,
    form,
    list: callList,
  })
  const typeTextList = makeEachType({
    base,
    form,
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
