import _ from 'lodash'

import { Base as FormBase } from '@tunebond/form.js'

import { Load, LoadRead } from './index.js'

export type Base = Record<string, Call>

export type Call = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load: (link: any) => Load
  read: LoadRead
}

export async function make(callBase: Base, base: FormBase) {
  const form = await makeForm(callBase, base)
  return form
}

export async function makeForm(callBase: Base, base: FormBase) {
  const text: Array<string> = []

  text.push(`export namespace Call {`)
  text.push(`export namespace Form {`)

  for (const callName in callBase) {
    const call = callBase[callName]

    text.push(`export type ${pascal(callName)} = {`)

    if (!call) {
      throw new Error(`No call ${callName}`)
    }

    for (const name in call.read) {
      const form = base[name]

      if (!form) {
        throw new Error(`No form ${name}`)
      }

      text.push(`${name}: {`)

      text.push(`}`)
    }

    text.push(`}`)
  }

  text.push(`}`)

  text.push(`export type Base = {`)

  for (const callName in callBase) {
    text.push(`${callName}: ${pascal(callName)}`)
  }

  text.push(`}`)

  text.push(`}`)

  return text.join('\n')
}

export async function makeTest(callBase: Base, base: FormBase) {
  const text: Array<string> = []

  for (const callName in callBase) {
    const call = callBase[callName]

    text.push(`const ${pascal(callName)}Test: z.ZodType<> = z.object(`)

    if (!call) {
      throw new Error(`No call ${callName}`)
    }

    for (const name in call.read) {
      const form = base[name]

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

    // for (const linkName in readForm.list) {
    //   if (!baseForm.link.hasOwnProperty(linkName)) {
    //     throw new Error(`Base ${formName} missing ${linkName}`)
    //   }

    //   const baseFormLink = baseForm.link[linkName]
    //   const readLink = readForm.list[linkName]

    //   if (readLink === true) {
    //     continue
    //   }

    //   if (!_.isObject(readLink)) {
    //   }
    // }
  }
}

function pascal(text: string) {
  return _.startCase(_.camelCase(text)).replace(/ /g, '')
}
