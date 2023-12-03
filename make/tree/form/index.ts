import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/cast/base'
import { FormLinkBaseCast } from '~/code/cast/form'

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

  list.push(`export type ${toPascalCase(name)}Cast = {`)
  hookEachProperty({ base, form }).forEach(line => {
    list.push(`  ${line}`)
  })
  list.push(`}`)

  return list
}

export function hookEachProperty({
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
        hookEachProperty({ base, form: link }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`}`)
        break
      default:
        if (link.like && base[link.like]) {
          const type = `${toPascalCase(link.like)}Cast`
          if (link.list) {
            list.push(`  ${name}?: List<${type}>`)
          } else {
            list.push(`  ${name}?: ${type}`)
          }
        } else if (link.link) {
          list.push(`  ${name}?: {`)
          hookEachProperty({ base, form: link }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`}`)
        } else if (typeof link.like === 'string') {
          const caseForm = Object.values(base).filter(form =>
            form.case?.includes(link.like),
          )

          if (!caseForm.length) {
            console.log(name, link)
            throw new Error(
              `Polymorphic association must be bound to at least 1 form.`,
            )
          }

          const type = caseForm
            .map(form => `${toPascalCase(form.name)}Cast`)
            .join(' | ')
          if (link.list) {
            list.push(`  ${name}?: List<${type}>`)
          } else {
            list.push(`  ${name}?: ${type}`)
          }
        } else {
          console.log(typeof link.like)
          console.log(name, link)
          throw new Error(`Link must have like or link`)
        }
    }
  }

  return list
}
