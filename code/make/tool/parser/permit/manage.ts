import { toPascalCase } from '~/code/tool/helper'
import { BaseType } from '~/code/type/base'
import { PermitType } from '~/code/type/permit'
import { FilterPermitType } from '~/code/type/permit/filter'
import {
  SchemaPropertyContainerType,
  SchemaPropertyType,
} from '~/code/type/schema'

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
    list.push(`filter: z.object({`)
    handleEachProperty({
      base,
      schema: { type: 'object', property: filter },
    }).forEach(line => {
      list.push(`  ${line}`)
    })
    list.push(`}),`)
  }

  return list
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
