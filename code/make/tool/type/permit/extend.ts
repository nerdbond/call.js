import { BaseType } from '~/code/type/base'
import {
  ExtendPermitType,
  ExtendPermitValueType,
} from '~/code/type/permit/extend'
import {
  SchemaPropertyContainerType,
  SchemaPropertyType,
} from '~/code/type/schema'
import { handleFilter } from './manage'
import { toPascalCase } from '~/code/tool/helper'

export function handleContainer({
  base,
  schema,
  extend,
  isList = false,
  hoist,
  path = [],
}: {
  path: Array<string>
  base: BaseType
  schema: SchemaPropertyContainerType
  extend: ExtendPermitType
  isList?: boolean
  hoist: Array<string>
}) {
  const list: Array<string> = []
  list.push(`| {`)

  if (isList) {
    list.push(`  total?: boolean`)
    list.push(`  randomize?: boolean`)
    list.push(`  single?: boolean`)

    if ('filter' in extend && extend.filter) {
      handleFilter({
        base,
        filter: extend.filter,
        optional: true,
      }).forEach(line => {
        list.push(`  ${line}`)
      })
    }
  }

  if (extend.extend) {
    list.push(`  extend?: {`)

    handleEachProperty({
      base,
      schema,
      extend: extend.extend,
      hoist,
      path,
    }).forEach(line => {
      list.push(`    ${line}`)
    })

    list.push(`  }`)
  }

  list.push(`}`)

  const nameName = path.map(toPascalCase).join('_')
  const nameList: Array<string> = [``]
  nameList.push(`export type ${nameName}ExtendType =`)
  list.forEach(line => {
    nameList.push(`  ${line}`)
  })

  hoist.push(...nameList)

  list.length = 0

  list.push(`| ${nameName}ExtendType`)
  list.push(`| {`)
  list.push(`    name: Record<string, ${nameName}ExtendType>`)
  list.push(`  }`)

  return list
}

export function handleEachProperty({
  base,
  schema,
  extend,
  hoist,
  path,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  extend: ExtendPermitType
  hoist: Array<string>
  path: Array<string>
}) {
  const list: Array<string> = []

  for (const name in extend) {
    const value = extend[name]
    const property = schema.property?.[name]
    if (!property) {
      // throw new Error(`${name}`)
      continue
    }

    handleProperty({
      name,
      base,
      property,
      value,
      path,
      hoist,
    }).forEach(line => {
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
  path,
  hoist,
}: {
  name: string
  base: BaseType
  property: SchemaPropertyType
  value: ExtendPermitValueType
  path: Array<string>
  hoist: Array<string>
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
        list.push(`${name}${optional}:`)
        handleContainer({
          base,
          schema: property,
          isList: false,
          extend: value,
          hoist,
          path: path.concat([name]),
        }).forEach(line => {
          list.push(`  ${line}`)
        })
      }
      break
    case 'record': {
      if (typeof value === 'object' && value.case) {
        list.push(`${name}${optional}:`)
        for (const name in value.case) {
          const container = value.case[name]
          const childSchema = base[name]
          handleContainer({
            base,
            schema: childSchema,
            isList: !!property.list,
            extend: container,
            hoist,
            path: path.concat([name]),
          }).forEach(line => {
            list.push(`  ${line}`)
          })
        }
      }
      break
    }
    default: {
      if (typeof value === 'object') {
        const childSchema = base[property.type]
        list.push(`${name}${optional}:`)
        handleContainer({
          base,
          schema: childSchema,
          isList: !!property.list,
          extend: value,
          hoist,
          path: path.concat([name]),
        }).forEach(line => {
          list.push(`  ${line}`)
        })
      }
    }
  }

  return list
}
