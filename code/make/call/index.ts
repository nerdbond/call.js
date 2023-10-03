import loveCode from '@nerdbond/love-code'
import makeEachParser from './parser'
import makeEachType from './type'
import { BaseType } from '~/code/type/base'
import { ExtendPermitType } from '~/code/type/permit/extend'
import { PermitBuilderMapType, PermitType } from '~/code/type/permit'

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

  for (const name in source) {
    const builder = source[name]

    if (typeof builder !== 'function') {
      continue
    }

    const call = builder()
    callList.push({ name, call })
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

  // console.log(typeTextList.join('\n'))

  const parser = await loveCode(parserTextList.join('\n'))
  const type = await loveCode(typeTextList.join('\n'))

  return { parser, type }
}
