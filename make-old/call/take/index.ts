import loveCode from '@wavebond/love-code'
import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/cast/mesh'
import { CallHaulMeshCast, CallHaulCast } from '~/code/cast/call'
import { ReadCallBaseCast, ReadCallCast } from '~/code/cast/call/read'
import { FormLinkBaseCast } from '~/code/cast/form'

export default async function hook({
  base,
  call,
}: {
  base: BaseCast
  call: CallHaulMeshCast
}) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
  list.push(`import * as Type from '.'`)

  for (const name in call) {
    list.push(``)
    hookOne({ base, name, call: call[name]() }).forEach(line => {
      list.push(line)
    })
  }

  const text = await loveCode(list.join('\n'))
  return text
}

export function hookOne({
  name,
  base,
  call,
}: {
  name: string
  base: BaseCast
  call: CallHaulCast
}) {
  const list: Array<string> = []
  const form = base[call.like]

  const typeName = toPascalCase(name)

  list.push(
    `export const ${typeName}: z.ZodType<Type.${typeName}Type> = z.object({`,
  )

  hookSchema({
    base,
    form,
    call,
    isList: false,
  }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`})`)

  return list
}

export function hookSchema({
  base,
  form,
  call,
  isList = false,
}: {
  base: BaseCast
  form: FormLinkBaseCast
  call: ReadCallBaseCast
  isList: boolean
}) {
  const list: Array<string> = []

  if (isList) {
    if ('size' in call && call.size) {
      list.push(`size: z.number().int(),`)
    }

    if ('read' in call && call.read) {
      list.push(`load: z.object({`)

      hookEachLink({
        base,
        form,
        read: call.read,
      }).forEach(line => {
        list.push(`  ${line}`)
      })

      list.push(`})`)
    }
  } else {
    if ('read' in call && call.read) {
      hookEachLink({
        base,
        form,
        read: call.read,
      }).forEach(line => {
        list.push(`${line}`)
      })
    }
  }

  return list
}

export function hookEachLink({
  base,
  form,
  read,
}: {
  base: BaseCast
  form: FormLinkBaseCast
  read: ReadCallCast
}) {
  const list: Array<string> = []
  for (const name in read) {
    const value = read[name]
    const link = form.link?.[name]
    if (!link) {
      continue
    }

    const prefix = !link.need ? 'z.optional(' : ''
    const suffix = !link.need ? ')' : ''
    switch (link.like) {
      case 'timestamp':
        list.push(`${name}: ${prefix}z.coerce.date()${suffix},`)
        break
      case 'text':
        list.push(`${name}: ${prefix}z.string().trim()${suffix},`)
        break
      case 'uuid':
        list.push(`${name}: ${prefix}z.string().uuid()${suffix},`)
        break
      case 'integer':
        list.push(`${name}: ${prefix}z.number().int()${suffix},`)
        break
      case 'decimal':
        list.push(`${name}: ${prefix}z.number()${suffix},`)
        break
      case 'boolean':
        list.push(`${name}: ${prefix}z.boolean()${suffix},`)
        break
      case 'json':
        list.push(
          `${name}: ${prefix}z.object({}).passthrough()${suffix},`,
        )
        break
      case 'object':
        if (typeof value === 'object') {
          list.push(`${name}: ${prefix}z.object({`)
          hookSchema({
            base,
            form: link,
            call: value,
            isList: !!link.list,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`})${suffix},`)
        }
        break
      case 'record':
        if (typeof value === 'object' && value.case) {
          list.push(`${name}: ${prefix}z.union([`)
          for (const name in value.case) {
            const childSchema = base[name]
            list.push(`  z.object({`)
            hookSchema({
              base,
              form: childSchema,
              call: value.case[name],
              isList: !!link.list,
            }).forEach(line => {
              list.push(`    ${line}`)
            })
            list.push(`  })`)
          }
          list.push(`])${suffix},`)
        }
        break
      default:
        if (typeof value === 'object') {
          const prefix = link.list ? 'z.array(' : ''
          const suffix = link.list ? ')' : ''
          list.push(`${name}: ${prefix}z.object({`)
          const childSchema = base[link.like]
          hookSchema({
            base,
            form: childSchema,
            call: value,
            isList: !!link.list,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`})${suffix},`)
        }
        break
    }
  }

  return list
}
