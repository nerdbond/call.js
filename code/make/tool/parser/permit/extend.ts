import { BaseType } from '~/code/form/base'
import {
  ExtendPermitType,
  ExtendPermitValueType,
} from '~/code/form/permit/extend'
import {
  SchemaPropertyContainerType,
  SchemaPropertyType,
} from '~/code/form/schema'
import { handleFilter } from './manage'
import { toPascalCase } from '~/code/tool/helper'

export function handleContainer({
  base,
  schema,
  extend,
  isList = false,
  hoist,
  path,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  extend: ExtendPermitType
  isList?: boolean
  hoist: Array<string>
  path: Array<string>
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

    handleEachProperty({
      base,
      schema,
      extend: extend.extend,
      hoist,
      path,
    }).forEach(line => {
      list.push(`    ${line}`)
    })

    list.push(`  })`)
    list.push(`),`)
  }

  const nameName = path.map(toPascalCase).join('_')
  const nameList: Array<string> = [``]
  nameList.push(`export const ${nameName}Extend = z.object({`)
  list.forEach(line => {
    nameList.push(`  ${line}`)
  })
  nameList.push(`})`)

  hoist.push(...nameList)

  list.length = 0

  list.push(`${nameName}Extend.merge(`)
  list.push(`  z.object({`)
  list.push(`    name: z.record(z.string(), ${nameName}Extend)`)
  list.push(`  })`)
  list.push(`),`)

  return list
}

export function handleEachProperty({
  base,
  schema,
  extend,
  path,
  hoist,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  extend: ExtendPermitType
  hoist: Array<string>
  path: Array<string>
}) {
  const list: Array<string> = []

  for (const name in extend) {
    const childExtend = extend[name]
    const childProperty = schema.property?.[name]

    if (childProperty) {
      handleProperty({
        name,
        base,
        property: childProperty,
        extend: childExtend,
        hoist,
        path,
      }).forEach(line => {
        list.push(`  ${line}`)
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
  hoist,
  path,
}: {
  name: string
  base: BaseType
  property: SchemaPropertyType
  extend: ExtendPermitValueType
  hoist: Array<string>
  path: Array<string>
}) {
  const list: Array<string> = []

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
      if (typeof extend === 'object') {
        list.push(`${name}: z.optional(`)
        handleContainer({
          base,
          schema: property,
          isList: false,
          extend,
          hoist,
          path: path.concat([name]),
        }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`),`)
      }
      break
    case 'record':
      if (typeof extend === 'object' && extend.case) {
        list.push(`${name}: z.optional(`)
        list.push(`  z.union([`)
        for (const name in extend.case) {
          const container = extend.case[name]
          const childSchema = base[name]
          handleContainer({
            base,
            schema: childSchema,
            isList: !!property.list,
            extend: container,
            hoist,
            path: path.concat([name]),
          }).forEach(line => {
            list.push(`    ${line}`)
          })
        }
        list.push(`  ])`)
        list.push(`),`)
      }
      break
    default: {
      if (typeof extend === 'object') {
        const childSchema = base[property.type]
        list.push(`${name}: z.optional(`)
        handleContainer({
          base,
          schema: childSchema,
          extend,
          isList: !!property.list,
          hoist,
          path: path.concat([name]),
        }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`),`)
      }
    }
  }

  return list
}
