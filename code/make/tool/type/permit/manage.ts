import { toPascalCase } from '~/code/tool/helper'
import { BaseType } from '~/code/form/base'
import { CreatePermitType } from '~/code/form/permit/create'
import { FilterPermitType } from '~/code/form/permit/filter'
import { RemovePermitType } from '~/code/form/permit/remove'
import { UpdatePermitType } from '~/code/form/permit/update'
import {
  SchemaPropertyContainerType,
  SchemaPropertyType,
} from '~/code/form/schema'

export type FilterLinkType = {
  path: Array<string>
  type: string
  optional?: boolean
}

export function handleFilter({
  base,
  filter,
  optional,
}: {
  base: BaseType
  filter: FilterPermitType
  optional?: boolean
}) {
  const list: Array<string> = []

  if (Array.isArray(filter)) {
    list.push(`filter${optional ? '?' : ''}:`)
    filter.forEach(filter => {
      list.push(`  | {`)
      handleEachProperty({
        base,
        schema: { type: 'object', property: filter },
      }).forEach(line => {
        list.push(`    ${line}`)
      })
      list.push(`  }`)
    })
  } else {
    const pathList: Array<FilterLinkType> = []
    const path = []
    handleEachFilterProperty({
      base,
      schema: { type: 'object', property: filter },
      list: pathList,
      path,
    })
    const filterPathList: Array<string> = []
    pathList.forEach(link => {
      const filterText = getFilterType(link.type)
      if (filterText) {
        filterPathList.push(`${filterText}`)
      }
    })
    list.push(
      `filter${
        optional ? '?' : ''
      }: Filter.FilterQueryType<${filterPathList.join(' | ')}>`,
    )
  }

  return list
}

function getFilterType(type: string) {
  switch (type) {
    case 'string':
      return `Filter.FilterStringType`
    case 'number':
      return `Filter.FilterNumberType`
    case 'date':
      return `Filter.FilterDateType`
    case 'boolean':
      return `Filter.FilterBooleanType`
  }
}

export function handleSchema({
  base,
  mutate,
  hoist,
}: {
  base: BaseType
  mutate: CreatePermitType | UpdatePermitType | RemovePermitType
  hoist: Array<string>
}) {
  const list: Array<string> = []
  list.push(`{`)

  if ('filter' in mutate && mutate.filter) {
    handleFilter({ base, filter: mutate.filter }).forEach(line => {
      list.push(`  ${line}`)
    })
  }

  if ('effect' in mutate && mutate.effect) {
    list.push(`  effect: {`)
    handleEachProperty({
      base,
      schema: { type: 'object', property: mutate.effect },
    }).forEach(line => {
      list.push(`    ${line}`)
    })
    list.push(`  }`)
  }

  list.push(`}`)

  if ('extend' in mutate && mutate.extend) {
    list.push(` & ${toPascalCase(mutate.extend)}Type`)
  } else {
    list.push(` & ExtendType`)
  }

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

    handleProperty({ base, name, property }).forEach(line => {
      list.push(`${line}`)
    })
  }
  return list
}

export function handleProperty({
  name,
  base,
  property,
}: {
  base: BaseType
  name: string
  property: SchemaPropertyType
}) {
  const list: Array<string> = []
  const optional = property.optional ? '?' : ''
  const listPrefix = property.list ? `Array<` : ''
  const listSuffix = property.list ? `>` : ''

  function push(expression: string) {
    list.push(
      `${name}${optional}: ${listPrefix}${expression}${listSuffix}`,
    )
  }

  switch (property.type) {
    case 'timestamp':
      push(`date`)
      break
    case 'text':
    case 'uuid':
      push(`string`)
      break
    case 'integer':
    case 'decimal':
      push(`number`)
      break
    case 'boolean':
      push(`boolean`)
      break
    case 'json':
      push(`object`)
      break
    case 'object':
    case undefined:
      list.push(`${name}${optional}: ${listPrefix}{`)
      handleEachProperty({ base, schema: property }).forEach(line => {
        list.push(`  ${line}`)
      })
      list.push(`}${listSuffix}`)
      break
    default:
      throw new Error(`Invalid permit type property '${property.type}'`)
  }

  return list
}

export function handleEachFilterProperty({
  base,
  schema,
  list,
  path,
}: {
  base: BaseType
  schema: SchemaPropertyContainerType
  list: Array<FilterLinkType>
  path: Array<string>
}) {
  for (const name in schema.property) {
    const property = schema.property[name]

    handleFilterProperty({
      base,
      name,
      property,
      list,
      path: path.concat([name]),
    })
  }
}

export function handleFilterProperty({
  name,
  base,
  property,
  list,
  path,
}: {
  base: BaseType
  name: string
  property: SchemaPropertyType
  list: Array<FilterLinkType>
  path: Array<string>
}) {
  const optional = property.optional ? '?' : ''
  const listPrefix = property.list ? `Array<` : ''
  const listSuffix = property.list ? `>` : ''

  // function push(expression: string) {
  //   list.push(
  //     `${name}${optional}: ${listPrefix}${expression}${listSuffix}`,
  //   )
  // }

  switch (property.type) {
    case 'timestamp':
      list.push({ type: `date`, path, optional: !!property.optional })
      break
    case 'text':
    case 'uuid':
      list.push({ type: `string`, path, optional: !!property.optional })
      break
    case 'integer':
    case 'decimal':
      list.push({ type: `number`, path, optional: !!property.optional })
      break
    case 'boolean':
      list.push({
        type: `boolean`,
        path,
        optional: !!property.optional,
      })
      break
    case 'json':
      list.push({ type: `object`, path, optional: !!property.optional })
      break
    case 'object':
    case undefined:
      // list.push(`${name}${optional}: ${listPrefix}{`)
      handleEachFilterProperty({
        base,
        schema: property,
        list,
        path,
      })
      // list.push(`}${listSuffix}`)
      break
    default:
      throw new Error(`Invalid permit type property '${property.type}'`)
  }

  return list
}
