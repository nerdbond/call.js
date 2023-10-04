import { toPascalCase } from '~/code/tool/helper'
import { BaseType } from '~/code/type/base'
import { PermitType } from '~/code/type/permit'
import { FilterPermitType } from '~/code/type/permit/filter'
import {
  SchemaPropertyContainerType,
  SchemaPropertyType,
} from '~/code/type/schema'
import { FilterLinkType } from '../../type/permit/manage'

export function handleFilter({
  base,
  filter,
}: {
  base: BaseType
  filter: FilterPermitType
}) {
  const list: Array<string> = []

  if (Array.isArray(filter)) {
    list.push(`filter: z.union([`)
    filter.forEach(filter => {
      list.push(`  z.object({`)
      handleEachProperty({
        base,
        schema: { type: 'object', property: filter },
      }).forEach(line => {
        list.push(`    ${line}`)
      })
      list.push(`  }),`)
    })
    list.push(`]),`)
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
        filterPathList.push(
          `${filterText}(${JSON.stringify(link.path)})`,
        )
      }
    })

    if (filterPathList.length > 1) {
      list.push(
        `filter: Filter.FilterQuery([${filterPathList.join(', ')}]),`,
      )
    } else {
      list.push(`filter: Filter.FilterQuery(${filterPathList[0]}),`)
    }
  }

  return list
}
function getFilterType(type: string) {
  switch (type) {
    case 'string':
      return `Filter.FilterString`
    case 'number':
      return `Filter.FilterNumber`
    case 'date':
      return `Filter.FilterDate`
    case 'boolean':
      return `Filter.FilterBoolean`
  }
}

export function handleSchema({
  base,
  mutate,
}: {
  base: BaseType
  mutate: PermitType
}) {
  const list: Array<string> = []
  list.push(`z.object({`)

  if ('filter' in mutate && mutate.filter) {
    handleFilter({ base, filter: mutate.filter }).forEach(line => {
      list.push(`  ${line}`)
    })
  }

  if ('effect' in mutate && mutate.effect) {
    list.push(`  effect: z.object({`)
    handleEachProperty({
      base,
      schema: { type: 'object', property: mutate.effect },
    }).forEach(line => {
      list.push(`    ${line}`)
    })
    list.push(`  }),`)
  }

  list.push(`})`)

  if ('extend' in mutate && typeof mutate.extend === 'string') {
    list.push(`.merge(${toPascalCase(mutate.extend)})`)
  } else {
    list.push(`.merge(Extend)`)
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

    handleProperty({
      name,
      base,
      property,
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
}: {
  name: string
  base: BaseType
  property: SchemaPropertyType
}) {
  const list: Array<string> = []

  switch (property.type) {
    case 'timestamp':
      push(name, `z.coerce.date()`)
      break
    case 'text':
      push(name, `z.string().trim()`)
      break
    case 'uuid':
      push(name, `z.string().uuid()`)
      break
    case 'integer':
      push(name, `z.number().int()`)
      break
    case 'decimal':
      push(name, `z.number()`)
      break
    case 'boolean':
      push(name, `z.boolean()`)
      break
    case 'json':
      push(name, `z.object({}).passthrough()`)
      break
    case 'object':
    case undefined: {
      if (property.optional) {
        list.push(`${name}: z.optional(`)
        list.push(`  z.object({`)
        handleEachProperty({ base, schema: property }).forEach(line => {
          list.push(`    ${line}`)
        })
        list.push(`  })`)
        list.push(`),`)
      } else {
        list.push(`${name}: z.object({`)
        handleEachProperty({ base, schema: property }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`}),`)
      }
      break
    }
    default:
      throw new Error(
        `Invalid permit manage property '${property.type}'`,
      )
  }

  return list

  function push(name: string, expression: string) {
    const text = property.optional
      ? `z.optional(${expression})`
      : expression
    list.push(`${name}: ${text},`)
  }
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
      name,
      base,
      property,
      list,
      path: path.concat([name]),
    })
  }
}

export function handleFilterProperty({
  name,
  base,
  list,
  path,
  property,
}: {
  name: string
  base: BaseType
  property: SchemaPropertyType
  list: Array<FilterLinkType>
  path: Array<string>
}) {
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
}
