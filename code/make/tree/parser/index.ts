import loveCode from '@nerdbond/love-code'
import { toPascalCase } from '~/code/tool/helper'
import { BaseType } from '~/code/type/base'
import { SchemaPropertyContainerType } from '~/code/type/schema'

export default async function handle({ base }: { base: BaseType }) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
  list.push(
    `import { paginated } from '@nerdbond/call/host/code/type/tree/mixin/paginated'`,
  )
  list.push(
    `import { record } from '@nerdbond/call/host/code/type/tree/mixin/record'`,
  )
  list.push(`import * as Type from '.'`)

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

  const typeName = toPascalCase(name)

  list.push(
    `export const ${typeName}: z.ZodType<Type.${typeName}Type> = z.object({`,
  )

  handleEachProperty({ base, schema }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`})`)

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
        list.push(`  ${name}: z.optional(z.coerce.date()),`)
        break
      case 'text':
        list.push(`  ${name}: z.optional(z.string().trim()),`)
        break
      case 'uuid':
        list.push(`  ${name}: z.optional(z.string().uuid()),`)
        break
      case 'integer':
        list.push(`  ${name}: z.optional(z.number().int()),`)
        break
      case 'decimal':
        list.push(`  ${name}: z.optional(z.number()),`)
        break
      case 'boolean':
        list.push(`  ${name}: z.optional(z.boolean()),`)
        break
      case 'json':
        list.push(`  ${name}: z.optional(z.object({}).passthrough()),`)
        break
      case 'object':
        list.push(`  ${name}: z.optional(z.object({`)
        handleEachProperty({ base, schema: property }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`})),`)
        break
      default:
        const type = base[property.type]
          ? toPascalCase(property.type)
          : 'z.object({}).passthrough()'
        if (property.list) {
          list.push(`  ${name}: paginated(() => ${type}),`)
        } else {
          list.push(`  ${name}: record(() => ${type}),`)
        }
    }
  }

  return list
}
