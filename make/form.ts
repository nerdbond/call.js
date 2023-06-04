import loveCode from '@tunebond/love-code'
import { Base } from '../index.js'
import { formCodeCase, makeHead, testFormCode } from './base.js'

export default async function make(base: Base, baseLink: string) {
  const form = await makeForm(base)
  const load = await makeLoad(base, baseLink)

  return { form, load }
}

export async function makeForm(base: Base) {
  const list: Array<string> = []

  list.push(`export namespace Form {`)

  let found = false

  for (const name in base.form) {
    const form = base.form[name]

    if (!testFormCode(form)) {
      continue
    }

    found = true

    list.push(
      `export type ${formCodeCase(name)} = ${readSiteForm(form.base)}`,
    )
  }

  if (!found) {
    return ''
  }

  list.push(`}`)

  list.push(`export type Base = {`)

  for (const name in base.form) {
    const form = base.form[name]

    if (!testFormCode(form)) {
      continue
    }

    list.push(`${name}: Form.${formCodeCase(name)}`)
  }

  list.push(`}`)

  const text = await loveCode(list.join('\n'))
  return text
}

export function readFormTest(form: string) {
  switch (form) {
    case 'text':
      return 'testText'
    case 'wave':
      return 'testWave'
    case 'mark':
      return 'testMark'
    default:
      throw new Error(`Unhandled ${form}`)
  }
}

export async function makeLoad(base: Base, baseLink: string) {
  const list: Array<string> = []

  const formLoadMesh: Record<string, boolean> = {}
  const loadList = []

  loadList.push(...makeHead())
  loadList.push(`import { z } from 'zod'`)
  loadList.push(`import base from '../${baseLink}'`)

  let found = false

  list.push(`const load = {`)

  for (const name in base.form) {
    const form = base.form[name]

    if (!testFormCode(form)) {
      continue
    }

    found = true

    const formTest = readFormTest(form.base)

    formLoadMesh[formTest] = true

    const formCodeCaseName = formCodeCase(name)

    list.push(
      `${formCodeCaseName}: z.custom<'${name}'>((bond: unknown) => {`,
    )

    if (form.test) {
      list.push(
        `return ${formTest}(bond) && base.form.${name}.test(bond)`,
      )
    } else {
      list.push(`return ${formTest}(bond)`)
    }

    list.push(`}),`)
  }

  list.push(`}`)

  list.push(`export default load`)

  if (!found) {
    return ''
  }

  const formLoadList = Object.keys(formLoadMesh)

  if (formLoadList.length) {
    loadList.push(
      `import { ${formLoadList.join(', ')} } from '@tunebond/have'`,
    )
  }

  list.unshift(...loadList)

  const text = await loveCode(list.join('\n'))
  return text
}

export function readSiteForm(form: string) {
  switch (form) {
    case 'text':
      return 'string'
    case 'date':
      return 'string'
    case 'mark':
      return 'number'
    case 'wave':
      return 'boolean'
    default:
      throw new Error(`Not yet supported '${form}'.`)
  }
}
