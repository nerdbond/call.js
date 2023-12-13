import loveCode from '@termsurf/love-code'
import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/cast/mesh'
import { ReadCallBaseCast, ReadCallCast } from '~/code/cast/call/read'

export default async function make({
  base,
  call,
  name,
}: {
  base: BaseCast
  call: CallHaulMeshCast
  name: string
}) {
  const list: Array<string> = []

  for (const task in call) {
    list.push(``)
    const load = {
      form: name,
      task,
      ...call[task](),
    }
    makeSite({ base, name: task, call: load }).forEach(line => {
      list.push(line)
    })
  }

  const text = await loveCode(list.join('\n'))
  return text
}

export function makeSite({
  name,
  base,
  call,
}: {
  name: string
  base: BaseCast
  call: CallHaulCast
}) {
  const list: Array<string> = []
  const form = base[call.form]

  list.push(`export type ${toPascalCase(name)}Cast = {`)

  makeForm({
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

export function makeForm({
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

      makeEachLink({
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
      makeEachLink({
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

export function makeEachLink({
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

    const optional = !link.need ? '?' : ''
    switch (link.like) {
      case 'timestamp':
        list.push(`${name}${optional}: Date`)
        break
      case 'text':
      case 'uuid':
        list.push(`${name}${optional}: string`)
        break
      case 'integer':
      case 'decimal':
        list.push(`${name}${optional}: number`)
        break
      case 'boolean':
        list.push(`${name}${optional}: boolean`)
        break
      case 'json':
        list.push(`${name}${optional}: object`)
        break
      case 'object':
        if (typeof value === 'object') {
          list.push(`${name}${optional}: {`)
          makeForm({
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
          list.push(`${name}${optional}:`)
          for (const name in value.case) {
            const childForm = base[name]
            list.push(`  | {`)
            makeForm({
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
          const childForm = base[link.like]
          makeForm({
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
