import { BaseType } from '~/code/form/base'
import {
  SchemaPropertyContainerType,
  SchemaPropertyType,
} from '~/code/form/schema'

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
      push(`Date`)
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
      list.push(`${name}${optional}: ${listPrefix}{`)
      handleEachProperty({ base, schema: property }).forEach(line => {
        list.push(`  ${line}`)
      })
      list.push(`}${listSuffix}`)
      break
    default:
      list.push(`${name}${optional}: ${listPrefix}{`)
      handleEachProperty({ base, schema: property }).forEach(line => {
        list.push(`  ${line}`)
      })
      list.push(`}${listSuffix}`)
      break
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
