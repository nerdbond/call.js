import loveCode from '@wavebond/love-code'
import { toPascalCase } from '~/code/tool/helper'
import { BaseType } from '~/code/form/base'
import { SchemaPropertyContainerType } from '~/code/form/schema'

export default async function handle({ base }: { base: BaseType }) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
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
  path = [],
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  path?: Array<string>
}) {
  const list: Array<string> = []
  for (const name in schema.property) {
    const property = schema.property[name]
    const field = path.concat([name]).join('__')
    switch (property.type) {
      case 'timestamp':
        list.push(`${field}: z.optional(z.nullable(z.coerce.date())),`)
        break
      case 'text':
        list.push(
          `${field}: z.optional(z.nullable(z.string().trim())),`,
        )
        break
      case 'uuid':
        list.push(
          `${field}: z.optional(z.nullable(z.string().uuid())),`,
        )
        break
      case 'integer':
        list.push(`${field}: z.optional(z.nullable(z.number().int())),`)
        break
      case 'decimal':
        list.push(`${field}: z.optional(z.nullable(z.number())),`)
        break
      case 'boolean':
        list.push(`${field}: z.optional(z.nullable(z.boolean())),`)
        break
      case 'json':
        list.push(
          `${field}: z.optional(z.nullable(z.object({}).passthrough())),`,
        )
        break
      case 'object':
        handleEachProperty({
          base,
          schema: property,
          path: path.concat([name]),
        }).forEach(line => {
          list.push(`${line}`)
        })
        break
      case 'record':
        list.push(
          `${path
            .concat([name, 'id'])
            .join('__')}: z.optional(z.nullable(z.string().uuid())),`,
        )
        list.push(
          `${path
            .concat([name, 'type'])
            .join('__')}?: z.optional(z.nullable(z.string().trim())),`,
        )
        break
      default:
        if (property.reference && !property.list) {
          list.push(
            `${path
              .concat([name, 'id'])
              .join(
                '__',
              )}?: z.optional(z.nullable(z.string().uuid())),`,
          )
        }
    }
  }

  return list
}
