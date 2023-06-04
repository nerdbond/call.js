import _ from 'lodash'
import path from 'path'

import type { Form, Base as FormBase, FormLink } from '@tunebond/form'
import loveCode from '@tunebond/love-code'
import { haveMesh, haveText, haveWave } from '@tunebond/have'

import { CallBase, LoadRead, LoadReadLink, ReadBase } from './index.js'

export async function make(
  callBase: CallBase,
  formBase: FormBase,
  readBase: ReadBase,
  callLink: string,
) {
  const form = await makeForm(
    callBase,
    formBase,
    readBase,
    '~/' +
      path.relative(process.cwd(), callLink).replace(/\.ts$/, '.js'),
  )
  return form
}

export async function makeForm(
  callBase: CallBase,
  formBase: FormBase,
  readBase: ReadBase,
  callLink: string,
) {
  const text: Array<string> = []

  text.push(`import fetch from 'cross-fetch'`)
  text.push(`import CallBase from '${callLink}'`)

  text.push(`export namespace Call {`)
  text.push(`export namespace Form {`)

  for (const callName in callBase) {
    const call = callBase[callName]
    haveMesh(call, 'call')

    text.push(`export type ${pascal(callName)} = {`)

    for (const name in call.read) {
      const read = readBase[name]
      const form = formBase[name]
      haveMesh(read, 'read')
      haveMesh(form, 'form')

      const load = call.read[name]
      haveMesh(load, 'load')

      text.push(`${name}: {`)

      makeRead(load, form, read)

      text.push(`}`)
    }

    text.push(`}`)
  }

  text.push(`}`)

  text.push(`export type Base = {`)

  for (const callName in callBase) {
    text.push(`${callName}: Form.${pascal(callName)}`)
  }

  text.push(`}`)

  text.push(`export type Name = keyof Base`)

  text.push(`}`)

  text.push(
    `export default async function call<Name extends Call.Name>(host: string, name: Name, link: Parameters<CallBase[Name]['load']>[0]) {`,
  )

  text.push(`const call = CallBase[name]`)
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
          const form = formBase[formLink.form]
          haveMesh(form, 'form')
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
      const form = formBase[link.form]
      haveMesh(form, 'form')
      haveMesh(call.list, 'call.list')
      makeRead(call.list, form, read.list)
      text.push(`}>`)
    }
  }
}

// write a function to build a zod string from a form base
export async function makeTest(callBase: CallBase, formBase: FormBase) {
  const text: Array<string> = []

  for (const callName in callBase) {
    const call = callBase[callName]

    text.push(`const ${pascal(callName)}Test: z.ZodType<> = z.object(`)

    if (!call) {
      throw new Error(`No call ${callName}`)
    }

    for (const name in call.read) {
      const form = formBase[name]

      if (!form) {
        throw new Error(`No form ${name}`)
      }
    }

    text.push(`)`)
  }
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

function pascal(text: string) {
  return _.startCase(_.camelCase(text)).replace(/ /g, '')
}
