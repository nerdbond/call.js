import _ from 'lodash'
import { Form, FormCode, FormLinkHostMoveName } from '@tunebond/form'
import { haveMesh, testMesh } from '@tunebond/have'
import { make8 } from '@tunebond/tone-code'
import halt from '../halt.js'
import { Base } from '~/make/base/take/index.js'

const CODE_NAME = '__code__'

let CODE = 1

export const SLOT: Array<FormLinkHostMoveName> = [
  'base',
  'baseSelf',
  'headSelf',
  'head',
]

export function formCodeCase(text: string) {
  return _.startCase(_.camelCase(text)).replace(/ /g, '')
}

export function makeFoot(
  base: Base,
  formMesh: Record<string, Record<string, string>>,
) {
  const list: Array<string> = []

  list.push(
    `export const load: Record<Name, Record<FormLinkHostMoveName, z.ZodTypeAny>> = {`,
  )

  for (const name in base.form) {
    const form = base.form[name]

    if (!testForm(form)) {
      continue
    }

    list.push(`${name}: {`)
    for (const slot of SLOT) {
      const slotMesh = formMesh[name]
      haveMesh(slotMesh, 'slotMesh')
      list.push(`${slot}: ${slotMesh[slot]},`)
    }
    list.push(`},`)
  }
  list.push(`}`)
  list.push(``)

  list.push(
    `export function need<N extends Name>(bond: unknown, form: N, move: FormLinkHostMoveName): asserts bond is Base[N] {`,
  )

  list.push(`const test = load[form][move]`)
  list.push(`test.parse(bond)`)

  list.push(`}`)
  list.push(``)

  list.push(
    `export function test<N extends Name>(bond: unknown, form: N, move: FormLinkHostMoveName): bond is Base[N] {`,
  )

  list.push(`const test = load[form][move]`)
  list.push(`const make = test.safeParse(bond)`)
  list.push(`if ('error' in make) {`)
  list.push(`console.log(make.error)`)
  list.push(`}`)
  list.push(`return make.success`)

  list.push(`}`)
  list.push(``)

  list.push(
    `export function take<N extends Name>(bond: unknown, form: N, move: FormLinkHostMoveName): Base[N] {`,
  )

  list.push(`const test = load[form][move] as z.ZodType<Base[N]>`)
  list.push(`return test.parse(bond)`)

  list.push(`}`)
  list.push(``)

  return list
}

export function makeHead() {
  const list: Array<string> = []
  list.push(`/* eslint-disable @typescript-eslint/no-namespace */`)
  return list
}

export function makeFormText(form: string) {
  switch (form) {
    case 'text':
    case 'string':
    case 'uuid':
    case 'cuid':
    case 'date':
      return 'string'
    case 'mark':
      return 'number'
    case 'number':
      return 'number'
    case 'wave':
      return 'boolean'
    case 'boolean':
      return 'boolean'
    default:
      return formCodeCase(form)
  }
}

export function makeFormZodText(form: string, base: Base) {
  switch (form) {
    case 'text':
    case 'string':
      return 'z.string()'
    case 'mark':
    case 'number':
      return 'z.number()'
    case 'wave':
    case 'boolean':
      return 'z.boolean()'
    case 'date':
      return 'z.string().datetime()'
    default: {
      const linkForm = base.form[form]

      if (testFormCode(linkForm)) {
        return `Load.${formCodeCase(form)}`
      } else if (testForm(linkForm)) {
        return `z.lazy(() => ${formCodeCase(form)}Load)`
      } else {
        throw new Error(`Undefined '${form}'`)
      }
    }
  }
}

export function testFormCode(bond: unknown): bond is FormCode {
  return testMesh(bond) && !('link' in bond)
}

export function haveFormCode(
  bond: unknown,
  name: string,
): asserts bond is FormCode {
  if (!testFormCode(bond)) {
    throw halt('form_miss', { name })
  }
}

export function saveCode(mesh: Record<string, unknown>) {
  if (!(CODE_NAME in mesh)) {
    Object.defineProperty(mesh, CODE_NAME, {
      enumerable: false,
      value: make8(BigInt(CODE++)),
    })
  }
}
