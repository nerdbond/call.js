import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/form/base'
import { FormLinkBaseCast } from '~/code/form/form'

export default function hook({ base }: { base: BaseCast }) {
  const list: Array<string> = []

  for (const name in base) {
    list.push(``)
    hookOne({ name, base }).forEach(line => {
      list.push(line)
    })
  }

  return list
}

export function hookOne({
  name,
  base,
}: {
  name: string
  base: BaseCast
}) {
  const list: Array<string> = []
  const form = base[name]

  const typeName = toPascalCase(name)

  list.push(
    `export const ${typeName}: z.ZodType<${typeName}Cast> = z.object({`,
  )

  hookEachLink({ base, form }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`})`)

  return list
}

export function hookEachLink({
  base,
  form,
}: {
  base: BaseCast
  form: FormLinkBaseCast
}) {
  const list: Array<string> = []
  for (const name in form.link) {
    const link = form.link[name]
    switch (link.like) {
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
        hookEachLink({ base, form: link }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`})),`)
        break
      default:
        const type = base[link.like]
          ? toPascalCase(link.like)
          : 'z.object({}).passthrough()'
        if (link.list) {
          list.push(`  ${name}: list(() => ${type}),`)
        } else {
          list.push(`  ${name}: record(() => ${type}),`)
        }
    }
  }

  return list
}
