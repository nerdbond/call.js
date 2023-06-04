import { HaltMesh, saveHalt } from '@tunebond/halt'
import { FormBase } from '../base.js'
import { Load, LoadRead, LoadSave, LoadSaveBase } from './load.js'
import {
  haveMesh,
  haveRise,
  testList,
  testMesh,
  testWave,
} from '@tunebond/have'
import halt from '../halt.js'
import { haveFormMesh } from './have.js'
import { FormLink, FormMesh } from '@tunebond/form'

export type Mesh = Record<string, unknown>

/**
 * Transform face to back.
 */

export default function make(load: Load, tree: FormBase) {
  const haltList: Array<HaltMesh> = []
  const loadHead: Load = { task: load.task, name: load.name }

  try {
    if (load.save) {
      const form = tree.save
      haveFormMesh(form, 'save')
      loadHead.save = makeForm(load.save, form, `save`, haltList)
    }
  } catch (kick) {
    saveHalt(haltList, kick)
  }

  try {
    if (load.read) {
      const form = tree.read
      haveFormMesh(form, 'read')
      loadHead.read = makeForm(load.read, form, `read`, haltList)
    }
  } catch (kick) {
    saveHalt(haltList, kick)
  }

  return loadHead
}

export function makeForm(
  mesh: Mesh,
  form: FormMesh,
  line: string,
  haltList: Array<HaltMesh>,
) {
  const head: Mesh = {}

  for (const name in mesh) {
    try {
      const lead = mesh[name]
      const link = form.link[name]
      const leadLine = `${line}.${name}`
      haveMesh(link, `${line}.${name}`)

      if (testList(lead)) {
        const list = []
        lead.forEach((lead, i) => {
          try {
            const leadLineNest = `${leadLine}.${i}`
            haveMesh(lead, leadLineNest)
            list.push(makeFormLink(lead, link, leadLineNest, haltList))
          } catch (kick) {
            saveHalt(haltList, kick)
          }
        })
        head[name] = list
      } else if (testMesh(lead)) {
        head[name] = makeFormLink(lead, link, leadLine, haltList)
      } else if (testWave(lead)) {
        haveRise(lead, name)
        head[name] = true
      } else {
        throw halt('form_miss', { need: ['mesh', 'wave'], call: name })
      }
    } catch (kick) {
      saveHalt(haltList, kick)
    }
  }

  return head
}

export function makeFormLink(
  mesh: Mesh,
  link: FormLink,
  line: string,
  haltList: Array<HaltMesh>,
) {
  haveFormLinkNest(link, line)

  for (const name in mesh) {
    const lead = mesh[name]

    switch (link.link.form) {
      case 'roll':
        break
      case 'like':
        link.link.nest
        break
      default:
        break
  }
}

export function haveFormLinkNest(
  link: FormLink,
  call: string,
): asserts link is Required<Pick<FormLink, 'link'>> {
  if (!link.link) {
    throw halt('link_miss', { call })
  }

  switch (link.link.form) {
    case 'roll':
    case 'like':
      break
    default:
      throw halt('link_take', { call })
  }
}
