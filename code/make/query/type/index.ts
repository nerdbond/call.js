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

  list.push(`export type ${toPascalCase(name)}Type = {`)

  handleSchema({
    base,
    schema,
    query,
    isList: false,
  }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`}`)

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
      list.push(`total: number`)
    }

    if ('extend' in query && query.extend) {
      list.push(`record: {`)

      handleEachProperty({
        base,
        schema,
        extend: query.extend,
      }).forEach(line => {
        list.push(`  ${line}`)
      })

      list.push(`}`)
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

    const optional = property.optional ? '?' : ''
    switch (property.type) {
      case 'timestamp':
        list.push(`${name}${optional}: Date`)
        break
      case 'text':
      case 'uuid':
        list.push(`${name}${optional}: string`)
        break
      case 'integer':
      case 'decimal':
        list.push(`${name}${optional}: number`)
        break
      case 'boolean':
        list.push(`${name}${optional}: boolean`)
        break
      case 'json':
        list.push(`${name}${optional}: object`)
        break
      case 'object':
        if (typeof value === 'object') {
          list.push(`${name}${optional}: {`)
          handleSchema({
            base,
            schema: property,
            query: value,
            isList: !!property.list,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`}`)
        }
        break
      case 'record':
        if (typeof value === 'object' && value.case) {
          list.push(`${name}${optional}:`)
          for (const name in value.case) {
            const childSchema = base[name]
            list.push(`  | {`)
            handleSchema({
              base,
              schema: childSchema,
              query: value.case[name],
              isList: !!property.list,
            }).forEach(line => {
              list.push(`    ${line}`)
            })
            list.push(`  }`)
          }
        }
        break
      default:
        if (typeof value === 'object') {
          const prefix = property.list ? 'Array<{' : '{'
          const suffix = property.list ? '}>' : '}'
          list.push(`${name}: ${prefix}`)
          const childSchema = base[property.type]
          handleSchema({
            base,
            schema: childSchema,
            query: value,
            isList: !!property.list,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`${suffix}`)
        }
        break
    }
  }

  return list
}
