import makeForm from '@tunebond/form/make.js'
import { Load } from './load.js'
import { FormTree } from '@tunebond/form'

/**
 * Transform face to back.
 */

export default function make(load: Load, tree: FormTree) {
  const { halt, head } = makeForm(load, tree)
  return { halt, head }
}

/**
 * Test face to back.
 */

export function test(load: Load, tree: FormTree) {
  const { halt, head } = makeForm(load, tree)
  return { halt, head }
}
