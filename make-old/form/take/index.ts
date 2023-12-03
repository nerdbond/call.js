import loveCode from '@wavebond/love-code'
import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/cast/mesh'
import { FormLinkBaseCast } from '~/code/cast/form'

export default async function hook({ base }: { base: BaseCast }) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
  list.push(`import * as Cast from '.'`)

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

  const typeName = toPascalCase(name)

  list.push(
    `export const ${typeName}: z.ZodType<Cast.${typeName}Cast> = z.object({`,
  )

  hookEachProperty({ base, form }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`})`)

  return list
}

export function hookEachProperty({
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
        list.push(`${field}: z.optional(z.nullable(z.coerce.date())),`)
        break
      case 'text':
        list.push(
          `${field}: z.optional(z.nullable(z.string().trim())),`,
        )
        break
      case 'uuid':
        list.push(
          `${field}: z.optional(z.nullable(z.string().uuid())),`,
        )
        break
      case 'integer':
        list.push(`${field}: z.optional(z.nullable(z.number().int())),`)
        break
      case 'decimal':
        list.push(`${field}: z.optional(z.nullable(z.number())),`)
        break
      case 'boolean':
        list.push(`${field}: z.optional(z.nullable(z.boolean())),`)
        break
      case 'json':
        list.push(
          `${field}: z.optional(z.nullable(z.object({}).passthrough())),`,
        )
        break
      case 'object':
        hookEachProperty({
          base,
          form: link,
          path: path.concat([name]),
        }).forEach(line => {
          list.push(`${line}`)
        })
        break
      case 'record':
        list.push(
          `${path
            .concat([name, 'id'])
            .join('__')}: z.optional(z.nullable(z.string().uuid())),`,
        )
        list.push(
          `${path
            .concat([name, 'type'])
            .join('__')}?: z.optional(z.nullable(z.string().trim())),`,
        )
        break
      default:
        if (link.bind && !link.list) {
          list.push(
            `${path
              .concat([name, 'id'])
              .join(
                '__',
              )}?: z.optional(z.nullable(z.string().uuid())),`,
          )
        }
    }
  }

  return list
}
