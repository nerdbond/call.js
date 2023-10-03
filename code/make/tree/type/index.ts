import loveCode from '@nerdbond/love-code'
import { toPascalCase } from '~/code/tool/helper'
import { BaseType } from '~/code/type/base'
import { SchemaPropertyContainerType } from '~/code/type/schema'

export default async function handle({ base }: { base: BaseType }) {
  const list: Array<string> = []

  list.push(`import { Paginated } from './mixin/paginated'`)

  for (const name in base) {
    list.push(``)
    handleOne({ name, base }).forEach(line => {
      list.push(line)
    })
  }

  const text = await loveCode(list.join('\n'))
  return text
}

export function handleOne({
  name,
  base,
}: {
  name: string
  base: BaseType
}) {
  const list: Array<string> = []
  const schema = base[name]

  list.push(`export type ${toPascalCase(name)}Type = {`)
  handleEachProperty({ base, schema }).forEach(line => {
    list.push(`  ${line}`)
  })
  list.push(`}`)

  return list
}

export function handleEachProperty({
  base,
  schema,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
}) {
  const list: Array<string> = []
  for (const name in schema.property) {
    const property = schema.property[name]
    switch (property.type) {
      case 'timestamp':
        list.push(`  ${name}?: Date`)
        break
      case 'text':
      case 'uuid':
        list.push(`  ${name}?: string`)
        break
      case 'integer':
      case 'decimal':
        list.push(`  ${name}?: number`)
        break
      case 'boolean':
        list.push(`  ${name}?: boolean`)
        break
      case 'json':
        list.push(`  ${name}?: object`)
        break
      case 'object':
        list.push(`  ${name}?: {`)
        handleEachProperty({ base, schema: property }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`}`)
        break
      default:
        const type = base[property.type]
          ? `${toPascalCase(property.type)}Type`
          : 'object'
        if (property.list) {
          list.push(`  ${name}?: Paginated<${type}>`)
        } else {
          list.push(`  ${name}?: ${type}`)
        }
    }
  }

  return list
}
