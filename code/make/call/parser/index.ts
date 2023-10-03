import { SchemaType } from '~/code/type/schema'
import * as extendApi from './extend'
import * as manageApi from './manage'
import { ExtendPermitType } from '~/code/type/permit/extend'
import { MutatePermitType } from '~/code/type/permit/mutate'
import { BaseType } from '~/code/type/base'

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
  textList.push(`import { z } from 'zod'`)
  textList.push(`import * as Type from '.'`)
  textList.push(...extendApi.handleEach({ base, schema, list: extend }))
  textList.push(...manageApi.handleEach({ base, schema, list: manage }))
  return textList
}
