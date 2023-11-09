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
  const schema = base[name]

  list.push(`export type ${toPascalCase(name)}Type = {`)
  hookEachProperty({ base, schema }).forEach(line => {
    list.push(`  ${line}`)
  })
  list.push(`}`)

  return list
}

export function hookEachProperty({
  base,
  schema,
}: {
  base: BaseCast
  schema: FormLinkBaseCast
}) {
  const list: Array<string> = []
  for (const name in schema.link) {
    const link = schema.link[name]
    switch (link.like) {
      case 'timestamp':
        list.push(`  ${name}?: Date`)
        break
      case 'text':
      case 'uuid':
        list.push(`  ${name}?: string`)
        break
      case 'integer':
      case 'decimal':
        list.push(`  ${name}?: number`)
        break
      case 'boolean':
        list.push(`  ${name}?: boolean`)
        break
      case 'json':
        list.push(`  ${name}?: object`)
        break
      case 'object':
        list.push(`  ${name}?: {`)
        hookEachProperty({ base, schema: link }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`}`)
        break
      default:
        const type = base[link.like]
          ? `${toPascalCase(link.like)}Type`
          : 'object'
        if (link.list) {
          list.push(`  ${name}?: List<${type}>`)
        } else {
          list.push(`  ${name}?: ${type}`)
        }
    }
  }

  return list
}
