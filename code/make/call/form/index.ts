import loveCode from '@wavebond/love-code'
import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/form/base'
import { CallHaulMeshCast, CallHaulCast } from '~/code/form/call'
import { ReadCallBaseCast, ReadCallCast } from '~/code/form/call/read'
import { FormLinkBaseCast } from '~/code/form/form'

export default async function hook({
  base,
  call,
}: {
  base: BaseCast
  call: CallHaulMeshCast
}) {
  const list: Array<string> = []

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

  list.push(`export type ${toPascalCase(name)}Type = {`)

  hookForm({
    base,
    form,
    call,
    isList: false,
  }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`}`)

  return list
}

export function hookForm({
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
      list.push(`size: number`)
    }

    if ('read' in call && call.read) {
      list.push(`load: {`)

      hookEachLink({
        base,
        form,
        read: call.read,
      }).forEach(line => {
        list.push(`  ${line}`)
      })

      list.push(`}`)
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

    const need = link.need ? '?' : ''
    switch (link.type) {
      case 'timestamp':
        list.push(`${name}${need}: Date`)
        break
      case 'text':
      case 'uuid':
        list.push(`${name}${need}: string`)
        break
      case 'integer':
      case 'decimal':
        list.push(`${name}${need}: number`)
        break
      case 'boolean':
        list.push(`${name}${need}: boolean`)
        break
      case 'json':
        list.push(`${name}${need}: object`)
        break
      case 'object':
        if (typeof value === 'object') {
          list.push(`${name}${need}: {`)
          hookForm({
            base,
            form: link,
            call: value,
            isList: !!link.list,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`}`)
        }
        break
      case 'record':
        if (typeof value === 'object' && value.case) {
          list.push(`${name}${need}:`)
          for (const name in value.case) {
            const childForm = base[name]
            list.push(`  | {`)
            hookForm({
              base,
              form: childForm,
              call: value.case[name],
              isList: !!link.list,
            }).forEach(line => {
              list.push(`    ${line}`)
            })
            list.push(`  }`)
          }
        }
        break
      default:
        if (typeof value === 'object') {
          const prefix = link.list ? 'Array<{' : '{'
          const suffix = link.list ? '}>' : '}'
          list.push(`${name}: ${prefix}`)
          const childForm = base[link.type]
          hookForm({
            base,
            form: childForm,
            call: value,
            isList: !!link.list,
          }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`${suffix}`)
        }
        break
    }
  }

  return list
}
