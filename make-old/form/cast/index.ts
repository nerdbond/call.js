import loveCode from '@wavebond/love-code'
import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/cast/mesh'
import { FormLinkBaseCast } from '~/code/cast/form'

export default async function hook({ base }: { base: BaseCast }) {
  const list: Array<string> = []

  for (const name in base) {
    list.push(``)
    hookOne({ name, base }).forEach(line => {
      list.push(line)
    })
  }

  const text = await loveCode(list.join('\n'))
  return text
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
  hookEachLink({ base, form }).forEach(line => {
    list.push(`  ${line}`)
  })
  list.push(`}`)

  return list
}

export function hookEachLink({
  base,
  form,
  path = [],
}: {
  base: BaseCast
  form: FormLinkBaseCast
  path?: Array<string>
}) {
  const list: Array<string> = []
  for (const name in form.link) {
    const link = form.link[name]
    const field = path.concat([name]).join('__')
    switch (link.like) {
      case 'timestamp':
        list.push(`${field}?: Date | null`)
        break
      case 'text':
      case 'uuid':
        list.push(`${field}?: string | null`)
        break
      case 'integer':
      case 'decimal':
        list.push(`${field}?: number | null`)
        break
      case 'boolean':
        list.push(`${field}?: boolean | null`)
        break
      case 'json':
        list.push(`${field}?: object | null`)
        break
      case 'object':
        hookEachLink({
          base,
          form: link,
          path: path.concat([name]),
        }).forEach(line => {
          list.push(`${line}`)
        })
        break
      case 'record':
        list.push(
          `${path.concat([name, 'id']).join('__')}?: string | null`,
        )
        list.push(
          `  ${path.concat([name, 'type']).join('__')}?: string | null`,
        )
        break
      default:
        if (link.bind && !link.list) {
          list.push(
            `  ${path.concat([name, 'id']).join('__')}?: string | null`,
          )
        }
    }
  }

  return list
}
