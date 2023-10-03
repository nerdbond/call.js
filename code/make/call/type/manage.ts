import { toPascalCase } from '~/code/tool/helper'
import { SchemaType } from '~/code/type/schema'
import * as manageTool from '~/code/make/tool/type/permit/manage'
import { BaseType } from '~/code/type/base'
import { MutatePermitType } from '~/code/type/permit/mutate'

export function handleEach({
  base,
  schema,
  list,
}: {
  base: BaseType
  schema: SchemaType
  list: Array<{
    name: string
    call: MutatePermitType
  }>
}) {
  const textList: Array<string> = []

  for (const { name, call } of list) {
    textList.push(``)

    switch (name) {
      case 'gather':
        handleOne({ name, base, schema, mutate: call }).forEach(
          line => {
            textList.push(line)
          },
        )
        break
      case 'select':
        handleOne({ name, base, schema, mutate: call }).forEach(
          line => {
            textList.push(line)
          },
        )
        break
      case 'create':
        handleOne({ name, base, schema, mutate: call }).forEach(
          line => {
            textList.push(line)
          },
        )
        break
      case 'update':
        handleOne({ name, base, schema, mutate: call }).forEach(
          line => {
            textList.push(line)
          },
        )
        break
      case 'remove':
        handleOne({ name, base, schema, mutate: call }).forEach(
          line => {
            textList.push(line)
          },
        )
        break
    }
  }

  return textList
}

export function handleOne({
  name,
  base,
  schema,
  mutate,
}: {
  name: string
  base: BaseType
  schema: SchemaType
  mutate: MutatePermitType
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type = {`)
  manageTool
    .handleSchema({
      base,
      mutate,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })
  list.push(`}`)

  return list
}
