import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/form/base'
import { FormLinkBaseCast } from '~/code/form/form'

export default function handle({ base }: { base: BaseCast }) {
  const list: Array<string> = []

  for (const name in base) {
    list.push(``)
    handleOne({ name, base }).forEach(line => {
      list.push(line)
    })
  }

  return list
}

export function handleOne({
  name,
  base,
}: {
  name: string
  base: BaseCast
}) {
  const list: Array<string> = []
  const schema = base[name]

  const typeName = toPascalCase(name)

  list.push(
    `export const ${typeName}: z.ZodType<${typeName}Type> = z.object({`,
  )

  handleEachProperty({ base, schema }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`})`)

  return list
}

export function handleEachProperty({
  base,
  schema,
}: {
  base: BaseCast
  schema: FormLinkBaseCast
}) {
  const list: Array<string> = []
  for (const name in schema.property) {
    const property = schema.property[name]
    switch (property.type) {
      case 'timestamp':
        list.push(`  ${name}: z.optional(z.coerce.date()),`)
        break
      case 'text':
        list.push(`  ${name}: z.optional(z.string().trim()),`)
        break
      case 'uuid':
        list.push(`  ${name}: z.optional(z.string().uuid()),`)
        break
      case 'integer':
        list.push(`  ${name}: z.optional(z.number().int()),`)
        break
      case 'decimal':
        list.push(`  ${name}: z.optional(z.number()),`)
        break
      case 'boolean':
        list.push(`  ${name}: z.optional(z.boolean()),`)
        break
      case 'json':
        list.push(`  ${name}: z.optional(z.object({}).passthrough()),`)
        break
      case 'object':
        list.push(`  ${name}: z.optional(z.object({`)
        handleEachProperty({ base, schema: property }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`})),`)
        break
      default:
        const type = base[property.type]
          ? toPascalCase(property.type)
          : 'z.object({}).passthrough()'
        if (property.list) {
          list.push(`  ${name}: paginated(() => ${type}),`)
        } else {
          list.push(`  ${name}: record(() => ${type}),`)
        }
    }
  }

  return list
}
