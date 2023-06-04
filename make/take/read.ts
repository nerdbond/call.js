import { Form, FormMesh, FormTree } from '@tunebond/form'
import { HaltMesh, saveHalt } from '@tunebond/halt'
import { haveMesh, testMesh, testWave } from '@tunebond/have'
import { Base, ReadTakeBase } from '../../base.js'
import {
  haveForm,
  haveFormMesh,
  testFormMesh,
} from '../../call/have.js'
import halt from '../../halt.js'

export function haveRise(
  wave: unknown,
  call: string,
): asserts wave is true {
  if (wave !== true) {
    throw halt('link_need', { call })
  }
}

export default function make(base: Base, haltList: Array<HaltMesh>) {
  const head: FormTree = {
    link: {},
  }
  haveMesh(head.link, 'link')

  for (const name in base.read) {
    const readLink = base.read[name]
    const baseForm = base.form[name]

    try {
      const formLine = `base.form.${name}`
      haveFormMesh(baseForm, formLine)

      const readLine = `base.read.${name}`
      haveMesh(readLink, readLine)

      const form = bindFormTree({
        base,
        formLine,
        readLine,
        readLink,
        baseForm,
        haltList,
      })

      head.link[name] = form
    } catch (kink) {
      saveHalt(haltList, kink)
    }
  }

  return head
}

export type BindForm = {
  base: Base
  formLine: string
  readLine: string
  readLink: ReadTakeBase
  baseForm: Form
  haltList: Array<HaltMesh>
  list?: boolean
}

export function bindForm({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
  list = false,
}: BindForm) {
  if (testFormMesh(baseForm)) {
    const headForm = bindFormTree({
      base,
      formLine,
      readLine,
      readLink,
      baseForm,
      haltList,
      list,
    })
    return headForm
  } else {
    return baseForm
  }
}

export type BindFormTreeList = {
  base: Base
  formLine: string
  readLine: string
  readLink: ReadTakeBase
  baseForm: FormMesh
  haltList: Array<HaltMesh>
}

export function bindFormTreeList({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
}: BindFormTreeList) {
  const form: FormTree = {
    link: {},
  }
  haveMesh(form.link, 'form.link')

  for (const readLinkName in readLink) {
    const lead = readLink[readLinkName]
    switch (readLinkName) {
      case 'size':
        haveRise(lead, `${readLine}.${readLinkName}`)
        form.link.size
        break
      case 'list':
        break
      default:
        throw halt('link_miss', { call: `${line}.${readLinkName}` })
    }
  }

  return form
}

export type LineHold = {
  form: string
  read: string
}

export type BindFormTree = {
  base: Base
  formLine: string
  readLine: string
  readLink: ReadTakeBase
  baseForm: FormMesh
  haltList: Array<HaltMesh>
  list?: boolean
}

export function bindFormTree({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
  list = false,
}: BindFormTree) {
  const leadForm: FormTree = {
    link: {},
  }
  haveMesh(leadForm.link, 'leadForm.link')

  if (list) {
    leadForm.link.read = bindFormTreeList({
      base,
      formLine,
      readLine,
      readLink,
      baseForm,
      haltList,
    })
  } else {
    leadForm.link.read = bindFormTreeMesh({
      base,
      formLine,
      readLine,
      readLink,
      baseForm,
      haltList,
    })
  }

  return leadForm
}

export type BindFormTreeMesh = {
  base: Base
  formLine: string
  readLine: string
  readLink: ReadTakeBase
  baseForm: FormMesh
  haltList: Array<HaltMesh>
}

export function bindFormTreeMesh({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
}: BindFormTreeMesh) {
  const form: FormTree = {
    link: {},
  }
  haveMesh(form.link, 'form.link')

  for (const readName in readLink) {
    try {
      const readBase = readLink[readName]
      const baseFormLink = baseForm.link[readName]
      const readLinkLine = `${readLine}.${readName}`
      const formLinkLine = `${formLine}.${readName}`
      haveMesh(baseFormLink, readLinkLine)

      const headLink: FormTree = { void: true }

      form.link[readName] = headLink

      if (testMesh(readBase)) {
        if (Array.isArray(baseFormLink.form)) {
          const readBaseNameLine = `${readLinkLine}.name`
          haveMesh(readBase.name, readBaseNameLine)

          const headLinkName = (headLink.name = {})
          haveMesh(headLinkName, 'headLinkName')

          for (const readLinkName in readBase.name) {
            try {
              const find = baseFormLink.form.find(
                form => form === readLinkName,
              )
              const readBaseLinkLine = `${readBaseNameLine}.${readLinkName}`
              haveFormBond(find, readBaseLinkLine)

              // headLinkName[readLinkName] = bindFormTree
            } catch (kink) {
              saveHalt(haltList, kink)
            }
          }
        } else if (baseFormLink.form) {
          const nestBaseForm = base.form[baseFormLink.form]
          haveFormMesh(nestBaseForm, formLinkLine)

          const headLinkLink = (headLink.link = {})
          haveMesh(headLinkLink, 'headLinkLink')

          bindFormTree({
            base,
            formLine: formLinkLine,
            readLine: readLinkLine,
            baseForm: nestBaseForm,
            readLink: readBase,
            haltList,
            list: baseFormLink.list === true,
          })
        }
      } else if (testWave(readBase)) {
        haveRise(readBase, readLinkLine)
        form.form = 'wave'
      }
    } catch (kink) {
      saveHalt(haltList, kink)
    }
  }

  return form
}

function haveFormBond(
  find: unknown,
  call: string,
): asserts find is string {
  if (!find) {
    throw halt('link_form', { call })
  }
}
