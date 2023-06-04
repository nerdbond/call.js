import { Form, FormMesh } from '@tunebond/form'
import { testMesh } from '@tunebond/have'
import halt from '@tunebond/have/halt.js'

export function testFormMesh(bond: unknown): bond is FormMesh {
  return testMesh(bond) && 'link' in bond
}

export function haveFormMesh(
  bond: unknown,
  call: string,
): asserts bond is FormMesh {
  if (!testFormMesh(bond)) {
    throw halt('form_miss', { call })
  }
}

export function testForm(bond: unknown): bond is Form {
  return testMesh(bond) && 'link' in bond
}

export function haveForm(
  bond: unknown,
  call: string,
): asserts bond is Form {
  if (!testForm(bond)) {
    throw halt('form_miss', { call })
  }
}
