import _ from 'lodash'
import type { Form, FormLink } from '@tunebond/form'
import loveCode from '@tunebond/love-code'
import { haveMesh, haveText, haveWave } from '@tunebond/have'

import {
  Base,
  FormBase,
  LoadRead,
  LoadReadLink,
} from '../base/take/index.js'
import { formCodeCase, saveCode, haveForm, makeHead } from './base.js'

export default async function make(base: Base, baseLink: string) {
  codeBase(base)

  const form = await makeForm(base, baseLink)
  const load = await makeLoad(base)

  return { form, load }
}

export function codeBase(base: Base) {
  for (const callName in base.call) {
    const call = base.call[callName]
    haveMesh(call, 'call')
    saveCode(call.read)
  }
}

export async function makeForm(base: Base, baseLink: string) {
  const text: Array<string> = []

  text.push(...makeHead())
  text.push(`import fetch from 'cross-fetch'`)
  text.push(`import base, { Base } from '../${baseLink}'`)

  text.push(`export namespace Form {`)

  for (const callName in base.call) {
    const call = base.call[callName]
    haveMesh(call, 'call')

    text.push(`export type ${formCodeCase(callName)} = {`)

    for (const name in call.read) {
      const read = base.read[name]
      const form = base.form[name]
      haveMesh(read, 'read')
      haveMesh(form, 'form')

      const load = call.read[name]
      haveMesh(load, 'load')

      text.push(`${name}: {`)

      haveForm(form, name)

      makeRead(load, form, read)

      text.push(`}`)
    }

    text.push(`}`)
  }

  text.push(`}`)

  text.push(`export type Base = {`)

  for (const callName in base.call) {
    text.push(`${callName}: Form.${formCodeCase(callName)}`)
  }

  text.push(`}`)

  text.push(`export type Name = keyof Base`)

  text.push(
    `export default async function call<Name extends Call.Name>(host: string, name: Name, link: Parameters<Base['call'][Name]['load']>[0]) {`,
  )

  text.push(`const call = base.call[name]`)
  text.push(`const loadBase = await call.load(link)`)
  text.push(`const callHead = await fetch(host, {`)
  text.push(`  method: 'PATCH',`)
  text.push(`  headers: {`)
  text.push(`    'Content-Type': 'application/json',`)
  text.push(`    Accept: 'application/json'`)
  text.push(`  },`)
  text.push(`  body: JSON.stringify(loadBase)`)
  text.push(`})`)
  text.push(`if (callHead.status >= 400) {`)
  text.push(`  throw new Error(\`Status \${callHead.status}\`)`)
  text.push(`}`)
  text.push(`const loadHead = await callHead.json()`)
  text.push(`return loadHead`)

  text.push(`}`)

  return await loveCode(text.join('\n'))

  function makeRead(
    call: LoadReadLink,
    form: Form,
    read: LoadReadLink,
  ) {
    for (const name in call.read) {
      const formLink = form.link[name]
      const callLink = call.read[name]

      haveMesh(formLink, 'formLink')

      let readLink

      if (read.list) {
        haveMesh(read.read.list, 'read.read.list')
        readLink = read.read.list.read[name]
      } else {
        readLink = read.read[name]
      }

      if (callLink === true) {
        const nullable = formLink.void ? '?' : ''
        switch (formLink.form) {
          case 'text':
          case 'code':
          case 'uuid':
            haveWave(readLink, 'readLink')
            text.push(`${name}${nullable}: string`)
            break
          case 'date':
            haveWave(readLink, 'readLink')
            text.push(`${name}${nullable}: string`)
            break
          case 'mark':
            haveWave(readLink, 'readLink')
            text.push(`${name}${nullable}: number`)
            break
          case 'wave':
            haveWave(readLink, 'readLink')
            text.push(`${name}${nullable}: boolean`)
            break
          default:
            throw new Error(String(formLink.form))
            break
        }
      } else {
        haveMesh(callLink, 'callLink')
        haveMesh(readLink, 'readLink')
        if (callLink.list) {
          text.push(`${name}: {`)
          makeReadList(callLink.read, formLink, readLink.read)
          text.push(`}`)
        } else {
          const nullable = formLink.void ? '?' : ''
          text.push(`${name}${nullable}: {`)
          haveText(formLink.form, 'formLink.form')
          const form = base.form[formLink.form]
          haveMesh(form, 'form')
          haveForm(form, formLink.form)
          makeRead(callLink, form, readLink)
          text.push(`}`)
          // makeReadMesh(formLink, readLink)
        }
      }
    }
  }

  function makeReadList(
    call: LoadRead,
    link: FormLink,
    read: LoadRead,
  ) {
    haveMesh(link, 'link')

    if (call.size) {
      haveWave(read.size, 'read.size')
      text.push(`size: number`)
    }

    if (call.list) {
      haveMesh(read.list, 'read.list')
      text.push(`list: Array<{`)
      haveText(link.form, 'link.form')
      const form = base.form[link.form]
      haveMesh(form, 'form')
      haveMesh(call.list, 'call.list')
      haveForm(form, link.form)
      makeRead(call.list, form, read.list)
      text.push(`}>`)
    }
  }
}

// write a function to build a zod string from a form base
export async function makeLoad(base: Base) {
  const text: Array<string> = []

  for (const callName in base.call) {
    const call = base.call[callName]
    if (!call) {
      continue
    }

    text.push(
      `const ${formCodeCase(callName)}Test: z.ZodType<> = z.object(`,
    )

    for (const name in call.read) {
      const form = base.form[name]
      haveForm(form, name)
    }

    text.push(`)`)
  }

  return await loveCode(text.join('\n'))
}

export async function test(read: LoadRead, base: FormBase) {
  for (const formName in read) {
    if (!base.hasOwnProperty(formName)) {
      throw new Error(`Base missing ${formName}`)
    }

    const baseForm = base[formName]
    const readForm = read[formName]

    if (!_.isObject(readForm) || !_.isObject(baseForm)) {
      throw new Error()
    }

    if (!('list' in readForm) || !_.isObject(readForm.list)) {
      throw new Error()
    }
  }
}
