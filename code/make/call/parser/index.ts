import { SchemaType } from '~/code/type/schema'
import * as extendTool from '~/code/make/tool/parser/permit/extend'
import * as manageTool from '~/code/make/tool/parser/permit/manage'
import { ExtendPermitType } from '~/code/type/permit/extend'
import { BaseType } from '~/code/type/base'
import { PermitType } from '~/code/type/permit'
import { toPascalCase } from '~/code/tool/helper'
import { CreatePermitType } from '~/code/type/permit/create'
import { UpdatePermitType } from '~/code/type/permit/update'
import { RemovePermitType } from '~/code/type/permit/remove'

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
  textList.push(`import { z } from 'zod'`)
  textList.push(`import * as Type from '.'`)
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
          textList.push(line)
        })
        break
    }

    hoist.push(...textList)
  }

  for (const { name, call } of list) {
    const textList: Array<string> = []

    textList.push(``)

    switch (name) {
      case 'create':
        handleCreate({
          name,
          base,
          schema,
          mutate: call as CreatePermitType,
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

  list.push(`export const Extend =`)

  extendTool
    .handleContainer({ base, schema, extend, hoist, path: ['base'] })
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
}: {
  name: string
  base: BaseType
  schema: SchemaType
  mutate: CreatePermitType
}) {
  const list: Array<string> = []

  const typeName = toPascalCase(name)
  list.push(
    `export const ${typeName}: z.ZodType<Type.${typeName}Type> =`,
  )

  manageTool.handleSchema({ base, mutate }).forEach(line => {
    list.push(`  ${line}`)
  })

  return list
}

export function handleUpdate({
  name,
  base,
  schema,
  mutate,
}: {
  name: string
  base: BaseType
  schema: SchemaType
  mutate: UpdatePermitType
}) {
  const list: Array<string> = []

  const typeName = toPascalCase(name)
  list.push(
    `export const ${typeName}: z.ZodType<Type.${typeName}Type> =`,
  )

  manageTool.handleSchema({ base, mutate }).forEach(line => {
    list.push(`  ${line}`)
  })

  return list
}

export function handleRemove({
  name,
  base,
  schema,
  mutate,
}: {
  name: string
  base: BaseType
  schema: SchemaType
  mutate: RemovePermitType
}) {
  const list: Array<string> = []

  const typeName = toPascalCase(name)
  list.push(
    `export const ${typeName}: z.ZodType<Type.${typeName}Type> =`,
  )

  manageTool.handleSchema({ base, mutate }).forEach(line => {
    list.push(`  ${line}`)
  })

  return list
}
