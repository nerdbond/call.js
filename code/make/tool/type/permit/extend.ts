import { BaseType } from '~/code/type/base'
import {
  ExtendPermitContainerType,
  ExtendPermitType,
  ExtendPermitValueType,
} from '~/code/type/permit/extend'
import {
  SchemaPropertyContainerType,
  SchemaPropertyType,
} from '~/code/type/schema'
import { handleFilter } from './manage'

export function handleEachProperty({
  base,
  schema,
  extend,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  extend: ExtendPermitType
}) {
  const list: Array<string> = []

  for (const name in extend) {
    const value = extend[name]
    const property = schema.property?.[name]
    if (!property) {
      // throw new Error(`${name}`)
      continue
    }

    handleProperty({ name, base, property, value }).forEach(line => {
      list.push(line)
    })
  }
  return list
}

export function handleProperty({
  name,
  base,
  property,
  value,
}: {
  name: string
  base: BaseType
  property: SchemaPropertyType
  value: ExtendPermitValueType
}) {
  const list: Array<string> = []

  const optional = '?'
  switch (property.type) {
    case 'timestamp':
    case 'text':
    case 'uuid':
    case 'integer':
    case 'decimal':
    case 'json':
    case 'boolean':
      list.push(`${name}${optional}: boolean`)
      break
    case 'object':
      if (typeof value === 'object') {
        list.push(`${name}${optional}: {`)
        handleContainer({
          base,
          schema: property,
          isList: false,
          extend: value,
        }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`}`)
      }
      break
    case 'record': {
      if (typeof value === 'object' && value.case) {
        list.push(`${name}${optional}:`)
        for (const name in value.case) {
          const container = value.case[name]
          const childSchema = base[name]
          list.push(`  | {`)
          handleContainer({
            base,
            schema: childSchema,
            isList: !!property.list,
            extend: container,
          }).forEach(line => {
            list.push(`    ${line}`)
          })
          list.push(`  }`)
        }
      }
      break
    }
    default: {
      if (typeof value === 'object') {
        const childSchema = base[property.type]
        list.push(`${name}${optional}: {`)
        handleContainer({
          base,
          schema: childSchema,
          isList: !!property.list,
          extend: value,
        }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`}`)
      }
    }
  }

  return list
}

export function handleContainer({
  base,
  schema,
  extend,
  isList = false,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  extend: ExtendPermitContainerType
  isList: boolean
}) {
  const list: Array<string> = []

  if (isList) {
    list.push(`total?: boolean`)
    list.push(`randomize?: boolean`)

    if ('filter' in extend && extend.filter) {
      handleFilter({
        base,
        filter: extend.filter,
        optional: true,
      }).forEach(line => {
        list.push(line)
      })
    }
  }

  if (extend.extend) {
    list.push(`extend?: {`)

    handleEachProperty({
      base,
      schema,
      extend: extend.extend,
    }).forEach(line => {
      list.push(`  ${line}`)
    })

    list.push(`}`)
  }

  return list
}
