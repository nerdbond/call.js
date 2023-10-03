import { ExtendPermitType } from '~/code/type/permit/extend'
import { MutatePermitType } from '~/code/type/permit/mutate'
import * as extendApi from './extend'
import * as manageApi from './manage'
import { BaseType } from '~/code/type/base'
import { SchemaType } from '~/code/type/schema'

export default function handle({
  base,
  schema,
  extend,
  manage,
}: {
  base: BaseType
  schema: SchemaType
  extend: Array<{
    name: string
    call: ExtendPermitType
  }>
  manage: Array<{
    name: string
    call: MutatePermitType
  }>
}) {
  const textList: Array<string> = []
  textList.push(...extendApi.handleEach({ base, schema, list: extend }))
  textList.push(...manageApi.handleEach({ base, schema, list: manage }))
  return textList
}
