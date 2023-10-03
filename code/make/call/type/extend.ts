import { SchemaType } from '~/code/type/schema'
import { BaseType } from '~/code/type/base'
import { toPascalCase } from '~/code/tool/helper'
import * as extendTool from '~/code/make/tool/type/permit/extend'
import { ExtendPermitType } from '~/code/type/permit/extend'

export function handleEach({
  base,
  schema,
  list,
}: {
  base: BaseType
  schema: SchemaType
  list: Array<{
    name: string
    call: ExtendPermitType
  }>
}) {
  const textList: Array<string> = []

  for (const { name, call } of list) {
    textList.push(``)

    switch (name) {
      case 'gather':
        handleOne({ name, base, schema, extend: call }).forEach(
          line => {
            textList.push(`  ${line}`)
          },
        )
        break
      case 'select':
        handleOne({ name, base, schema, extend: call }).forEach(
          line => {
            textList.push(`  ${line}`)
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
  extend,
}: {
  name: string
  base: BaseType
  schema: SchemaType
  extend: ExtendPermitType
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}ExtendType = {`)

  extendTool
    .handleEachProperty({ base, schema, extend })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  list.push(`}`)

  return list
}
