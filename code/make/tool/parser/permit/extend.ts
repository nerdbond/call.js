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
    const childExtend = extend[name]
    const childProperty = schema.property?.[name]

    if (childProperty) {
      const childList = handleProperty({
        name,
        base,
        property: childProperty,
        extend: childExtend,
      })

      childList.forEach(line => {
        list.push(line)
      })
    }
  }

  return list
}

export function handleProperty({
  name,
  base,
  property,
  extend,
}: {
  name: string
  base: BaseType
  property: SchemaPropertyType
  extend: ExtendPermitValueType
}) {
  const list: Array<string> = []

  const value = extend[name]
  switch (property.type) {
    case 'timestamp':
    case 'text':
    case 'uuid':
    case 'integer':
    case 'decimal':
    case 'json':
    case 'boolean':
      list.push(`${name}: z.optional(z.boolean()),`)
      break
    case 'object':
      if (typeof value === 'object') {
        list.push(`${name}: z.optional(z.object({`)
        handleContainer({
          base,
          schema: property,
          isList: false,
          extend: value,
        }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`})),`)
      }
      break
    case 'record':
      if (typeof value === 'object' && value.case) {
        list.push(`${name}: z.optional(`)
        list.push(`  z.union([`)
        for (const name in value.case) {
          const container = value.case[name]
          const childSchema = base[name]
          list.push(`    z.object({`)
          handleContainer({
            base,
            schema: childSchema,
            isList: !!property.list,
            extend: container,
          }).forEach(line => {
            list.push(`      ${line}`)
          })
          list.push(`    })`)
        }
        list.push(`  ])`)
        list.push(`),`)
      }
      break
    default: {
      if (typeof value === 'object') {
        const childSchema = base[property.type]
        list.push(`${name}: z.optional(`)
        list.push(`  z.object({`)
        handleContainer({
          base,
          schema: childSchema,
          extend: value,
          isList: !!property.list,
        }).forEach(line => {
          list.push(`    ${line}`)
        })
        list.push(`  })`)
        list.push(`),`)
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
    list.push(`total: z.optional(z.boolean()),`)
    list.push(`randomize: z.optional(z.boolean()),`)

    if ('filter' in extend && extend.filter) {
      handleFilter({ base, filter: extend.filter }).forEach(line => {
        list.push(line)
      })
    }
  }

  if (extend.extend) {
    list.push(`extend: z.optional(`)
    list.push(`  z.object({`)

    handleEachProperty({ base, schema, extend: extend.extend }).forEach(
      line => {
        list.push(`  ${line}`)
      },
    )

    list.push(`  })`)
    list.push(`),`)
  }

  return list
}
