import { PermitType } from '~/code/form/permit'
import * as extendTool from '~/code/make/tool/type/permit/extend'
import * as manageTool from '~/code/make/tool/type/permit/manage'
import { BaseType } from '~/code/form/base'
import { SchemaType } from '~/code/form/schema'
import { toPascalCase } from '~/code/tool/helper'
import { ExtendPermitType } from '~/code/form/permit/extend'
import { CreatePermitType } from '~/code/form/permit/create'
import { UpdatePermitType } from '~/code/form/permit/update'
import { RemovePermitType } from '~/code/form/permit/remove'

export default function handle({
  base,
  schema,
  list,
}: {
  base: BaseType
  schema: SchemaType
  list: Array<{
    name: string
    call: PermitType
  }>
}) {
  const textList: Array<string> = []
  textList.push(`import { Filter } from '@wavebond/call'`)
  handleEach({ base, schema, list, hoist: textList })
  return textList
}

export function handleEach({
  base,
  schema,
  list,
  hoist,
}: {
  base: BaseType
  schema: SchemaType
  list: Array<{
    name: string
    call: PermitType
  }>
  hoist: Array<string>
}) {
  for (const { name, call } of list) {
    const textList: Array<string> = []

    textList.push(``)

    switch (name) {
      case 'extend':
        handleExtend({
          name,
          base,
          schema,
          extend: call as ExtendPermitType,
          hoist,
        }).forEach(line => {
          textList.push(`  ${line}`)
        })
        break
      case 'create':
        handleCreate({
          name,
          base,
          schema,
          mutate: call as CreatePermitType,
          hoist,
        }).forEach(line => {
          textList.push(line)
        })
        break
      case 'update':
        handleUpdate({
          name,
          base,
          schema,
          mutate: call as UpdatePermitType,
          hoist,
        }).forEach(line => {
          textList.push(line)
        })
        break
      case 'remove':
        handleRemove({
          name,
          base,
          schema,
          mutate: call as RemovePermitType,
          hoist,
        }).forEach(line => {
          textList.push(line)
        })
        break
    }

    hoist.push(...textList)
  }
}

export function handleExtend({
  name,
  base,
  schema,
  extend,
  hoist,
}: {
  name: string
  base: BaseType
  schema: SchemaType
  extend: ExtendPermitType
  hoist: Array<string>
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type =`)

  extendTool
    .handleContainer({
      base,
      schema,
      extend,
      hoist,
      path: ['base'],
      isList: true,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}

export function handleCreate({
  name,
  base,
  schema,
  mutate,
  hoist,
}: {
  name: string
  base: BaseType
  schema: SchemaType
  mutate: CreatePermitType
  hoist: Array<string>
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type =`)
  manageTool
    .handleSchema({
      base,
      mutate,
      hoist,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}

export function handleUpdate({
  name,
  base,
  schema,
  mutate,
  hoist,
}: {
  name: string
  base: BaseType
  schema: SchemaType
  mutate: UpdatePermitType
  hoist: Array<string>
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type =`)
  manageTool
    .handleSchema({
      base,
      mutate,
      hoist,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}

export function handleRemove({
  name,
  base,
  schema,
  mutate,
  hoist,
}: {
  name: string
  base: BaseType
  schema: SchemaType
  mutate: RemovePermitType
  hoist: Array<string>
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type =`)
  manageTool
    .handleSchema({
      base,
      mutate,
      hoist,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}
