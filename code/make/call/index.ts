import loveCode from '@nerdbond/love-code'
import makeEachParser from './parser'
import makeEachType from './type'
import { BaseType } from '~/code/type/base'
import {
  ExtendPermitBuilderMapType,
  ExtendPermitType,
} from '~/code/type/permit/extend'
import {
  MutatePermitBuilderMapType,
  MutatePermitType,
} from '~/code/type/permit/mutate'

export default async function make({
  base,
  name,
  extend,
  manage,
}: {
  base: BaseType
  name: string
  extend: ExtendPermitBuilderMapType
  manage: MutatePermitBuilderMapType
}) {
  const schema = base[name]

  const extendCallList: Array<{
    name: string
    call: ExtendPermitType
  }> = []
  const manageCallList: Array<{
    name: string
    call: MutatePermitType
  }> = []

  for (const name in extend) {
    const builder = extend[name]

    if (typeof builder !== 'function') {
      continue
    }

    const call = builder()
    extendCallList.push({ name, call })
  }

  for (const name in manage) {
    const builder = manage[name]

    if (typeof builder !== 'function') {
      continue
    }

    const call = builder()

    manageCallList.push({ name, call })
  }

  const parserTextList = makeEachParser({
    base,
    schema,
    extend: extendCallList,
    manage: manageCallList,
  })
  const typeTextList = makeEachType({
    base,
    schema,
    extend: extendCallList,
    manage: manageCallList,
  })

  console.log(parserTextList.join('\n'))
  console.log(typeTextList.join('\n'))

  const parser = await loveCode(parserTextList.join('\n'))
  const type = await loveCode(typeTextList.join('\n'))

  return { parser, type }
}
