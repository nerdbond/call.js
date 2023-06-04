import {
  Form,
  FormLink,
  FormLinkNestRoll,
  FormMesh,
} from '@tunebond/form'
import { Base, FormBase, SaveTakeBase } from '../../base/index.js'
import { haveMesh, testMesh } from '@tunebond/have'
import {
  haveForm,
  haveFormMesh,
  testFormMesh,
} from '../../call/have.js'
import { HaltMesh } from '@tunebond/halt'

export default function make(base: Base) {
  const haltList: Array<HaltMesh> = []
  const headBase: FormBase = {}

  for (const name in base.save) {
    const saveBase = base.save[name]
    const baseForm = base.form[name]

    haveFormMesh(baseForm, name)

    const line = `base.save.${name}`
    haveMesh(saveBase, line)

    const form = bindFormMesh(base, line, saveBase, baseForm)
    headBase[name] = form
  }

  return headBase
}

export function bindForm(
  base: Base,
  line: string,
  saveForm: SaveTakeBase,
  baseForm: Form,
) {
  if (testFormMesh(baseForm)) {
    const headForm = bindFormMesh(base, line, saveForm, baseForm)
    return headForm
  } else {
    return baseForm
  }
}

export function bindFormMesh(
  base: Base,
  line: string,
  saveForm: SaveTakeBase,
  baseForm: FormMesh,
) {
  const form: FormMesh = {
    link: {},
  }

  for (const saveLinkName in saveForm) {
    const saveLink = saveForm[saveLinkName]
    const baseFormLink = baseForm.link[saveLinkName]
    haveMesh(baseFormLink, `${line}.${saveLinkName}`)

    const headLink: FormLink = { void: true }
    form.link[saveLinkName] = headLink

    // copy over useful properties
    if (baseFormLink.take) {
      headLink.take = baseFormLink.take
    }

    if (baseFormLink.size) {
      headLink.size = baseFormLink.size
    }

    if (baseFormLink.base) {
      headLink.base = baseFormLink.base
    }

    if (baseFormLink.host) {
      headLink.host = baseFormLink.host
    }

    if (baseFormLink.list) {
      headLink.list = baseFormLink.list
    }

    if (baseFormLink.test) {
      headLink.test = baseFormLink.test
    }

    if (testMesh(saveLink)) {
      if (Array.isArray(baseFormLink.form)) {
        const roll: FormLinkNestRoll = {
          form: 'roll',
          list: [],
        }
        baseFormLink.form.forEach(form => {
          const nestLinkForm = base.form[form]
          const headLine = `${line}.${saveLinkName}.${form}`
          haveForm(nestLinkForm, headLine)
          const nestForm = bindForm(
            base,
            headLine,
            saveLink,
            nestLinkForm,
          )
          roll.list.push({
            form: 'like',
            nest: nestForm,
          })
        })
        headLink.link = roll
      } else if (baseFormLink.form) {
        const nestLinkForm = base.form[baseFormLink.form]
        const headLine = `${line}.${saveLinkName}.${baseFormLink.form}`
        haveForm(nestLinkForm, headLine)
        const nestForm = bindForm(
          base,
          headLine,
          saveLink,
          nestLinkForm,
        )
        headLink.link = {
          form: 'like',
          nest: nestForm,
        }
      }
    }
  }

  return form
}
