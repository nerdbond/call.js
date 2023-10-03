import loveCode from '@nerdbond/love-code'
import { toPascalCase } from '~/code/tool/helper'
import { BaseType } from '~/code/type/base'
import {
  QueryPayloadMapType,
  QueryPayloadType,
} from '~/code/type/query'
import {
  ExtendQueryContainerType,
  ExtendQueryType,
} from '~/code/type/query/extend'
import { SchemaPropertyContainerType } from '~/code/type/schema'

export default async function handle({
  base,
  query,
}: {
  base: BaseType
  query: QueryPayloadMapType
}) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
  list.push(`import * as Type from '.'`)

  for (const name in query) {
    list.push(``)
    handleOne({ base, name, query: query[name]() }).forEach(line => {
      list.push(line)
    })
  }

  const text = await loveCode(list.join('\n'))
  return text
}

export function handleOne({
  name,
  base,
  query,
}: {
  name: string
  base: BaseType
  query: QueryPayloadType
}) {
  const list: Array<string> = []
  const schema = base[query.object]

  const typeName = toPascalCase(name)

  list.push(
    `export const ${typeName}: z.ZodType<Type.${typeName}Type> = z.object({`,
  )

  handleSchema({
    base,
    schema,
    query,
    isList: query.action === 'gather',
  }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`})`)

  return list
}

export function handleSchema({
  base,
  schema,
  query,
  isList = false,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  query: ExtendQueryContainerType
  isList: boolean
}) {
  const list: Array<string> = []

  if (isList) {
    if ('total' in query && query.total) {
      list.push(`total: z.number().int(),`)
    }

    if ('extend' in query && query.extend) {
      list.push(`record: z.object({`)

      handleEachProperty({
        base,
        schema,
        extend: query.extend,
      }).forEach(line => {
        list.push(`  ${line}`)
      })

      list.push(`})`)
    }
  } else {
    if ('extend' in query && query.extend) {
      handleEachProperty({
        base,
        schema,
        extend: query.extend,
      }).forEach(line => {
        list.push(`${line}`)
      })
    }
  }

  return list
}

export function handleEachProperty({
  base,
  schema,
  extend,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  extend: ExtendQueryType
}) {
  const list: Array<string> = []
  for (const name in extend) {
    const value = extend[name]
    const property = schema.property?.[name]
    if (!property) {
      continue
    }

    const prefix = property.optional ? 'z.optional(' : ''
    const suffix = property.optional ? ')' : ''
    switch (property.type) {
      case 'timestamp':
        list.push(`${name}: ${prefix}z.coerce.date()${suffix},`)
        break
      case 'text':
        list.push(`${name}: ${prefix}z.string().trim()${suffix},`)
        break
      case 'uuid':
        list.push(`${name}: ${prefix}z.string().uuid()${suffix},`)
        break
      case 'integer':
        list.push(`${name}: ${prefix}z.number().int()${suffix},`)
        break
      case 'decimal':
        list.push(`${name}: ${prefix}z.number()${suffix},`)
        break
      case 'boolean':
        list.push(`${name}: ${prefix}z.boolean()${suffix},`)
        break
      case 'json':
        list.push(
          `${name}: ${prefix}z.object({}).passthrough()${suffix},`,
        )
        break
      case 'object':
        if (typeof value === 'object') {
          list.push(`${name}: ${prefix}z.object({`)
          handleSchema({
            base,
            schema: property,
            query: value,
            isList: !!property.list,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`})${suffix},`)
        }
        break
      case 'record':
        if (typeof value === 'object' && value.case) {
          list.push(`${name}: ${prefix}z.union([`)
          for (const name in value.case) {
            const childSchema = base[name]
            list.push(`  z.object({`)
            handleSchema({
              base,
              schema: childSchema,
              query: value.case[name],
              isList: !!property.list,
            }).forEach(line => {
              list.push(`    ${line}`)
            })
            list.push(`  })`)
          }
          list.push(`])${suffix},`)
        }
        break
      default:
        if (typeof value === 'object') {
          const prefix = property.list ? 'z.array(' : ''
          const suffix = property.list ? ')' : ''
          list.push(`${name}: ${prefix}z.object({`)
          const childSchema = base[property.type]
          handleSchema({
            base,
            schema: childSchema,
            query: value,
            isList: !!property.list,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`})${suffix},`)
        }
        break
    }
  }

  return list
}
