import { Form, FormMesh, FormTree } from '@tunebond/form'
import { HaltMesh, saveHalt } from '@tunebond/halt'
import { haveMesh, testMesh, testWave } from '@tunebond/have'
import {
  Base,
  ReadTakeBase,
  ReadTakeBaseLink,
} from '../../base/index.js'
import { haveFormMesh, testFormMesh } from '../../call/have.js'
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
  const head = makeBaseFormTree({
    base,
    haltList,
    formLine: `base.form`,
    readLine: `base.read`,
  })
  return head
}

export type MakeFormTree = {
  base: Base
  haltList: Array<HaltMesh>
  formLine: string
  readLine: string
}

export function makeBaseFormTree({
  base,
  haltList,
  formLine,
  readLine,
}: MakeFormTree) {
  const head: FormTree = {
    link: {},
  }
  haveMesh(head.link, 'head.link')

  for (const name in base.read) {
    const readLink = base.read[name]
    const baseForm = base.form[name]

    try {
      const formNameLine = `${formLine}.${name}`
      haveFormMesh(baseForm, formNameLine)

      const readNameLine = `${readLine}.${name}`
      haveMesh(readLink, readNameLine)

      const tree = makeFormTree({
        base,
        formLine: formNameLine,
        readLine: readNameLine,
        readLink,
        baseForm,
        haltList,
        list: true,
      })

      head.link[name] = tree
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
    const headForm = makeFormTree({
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
  readLink: ReadTakeBaseLink
  baseForm: FormMesh
  haltList: Array<HaltMesh>
}

export function makeFormTreeList({
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

  for (const readLinkName in readLink.read) {
    const lead = readLink.read[readLinkName]
    const formLinkLine = `${formLine}`
    const readLinkLine = `${readLine}.${readLinkName}`
    switch (readLinkName) {
      case 'size':
        haveRise(lead, readLinkLine)
        form.link.size = { form: 'wave' }
        break
      case 'list':
        haveMesh(lead, readLinkLine)

        form.link.list = makeFormTree({
          base,
          formLine: formLinkLine,
          readLine: readLinkLine,
          readLink: lead,
          baseForm,
          haltList,
        })
        break
      default:
        throw halt('link_miss', { call: readLinkLine })
    }
  }

  return form
}

export type BindFormTree = {
  base: Base
  formLine: string
  readLine: string
  readLink: ReadTakeBaseLink
  baseForm: FormMesh
  haltList: Array<HaltMesh>
  list?: boolean
}

export function makeFormTree({
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
    leadForm.link.read = makeFormTreeList({
      base,
      formLine,
      readLine,
      readLink,
      baseForm,
      haltList,
    })
  } else {
    leadForm.link.read = makeFormTreeMesh({
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
  readLink: ReadTakeBaseLink
  baseForm: FormMesh
  haltList: Array<HaltMesh>
}

export function makeFormTreeMesh({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
}: BindFormTreeMesh) {
  const head: FormTree = {}
  head.link = {}
  haveMesh(head.link, 'form.link')

  for (const readName in readLink.read) {
    try {
      const readBase = readLink.read[readName]
      const baseFormLink = baseForm.link[readName]
      const readLinkLine = `${readLine}.${readName}`
      const formLinkLine = `${formLine}.${readName}`
      haveMesh(baseFormLink, readLinkLine)

      if (testMesh(readBase)) {
        if (Array.isArray(baseFormLink.form)) {
          const readBaseNameLine = `${readLinkLine}.name`
          haveMesh(readBase.name, readBaseNameLine)
          const headLink: FormTree = { void: true, name: {} }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const headLinkName = headLink.name
          haveMesh(headLinkName, 'headLinkName')

          for (const readLinkName in readBase.name) {
            try {
              const find = baseFormLink.form.find(
                form => form === readLinkName,
              )
              const readBaseLinkLine = `${readBaseNameLine}.name.${readLinkName}`
              haveFormBond(find, readBaseLinkLine)

              const nestBaseForm = base.form[readLinkName]
              haveFormMesh(nestBaseForm, formLinkLine)

              const readLink = readBase.name[readLinkName]
              haveMesh(readLink, readBaseLinkLine)

              const headLink = makeFormTree({
                base,
                formLine: formLinkLine,
                readLine: readLinkLine,
                baseForm: nestBaseForm,
                readLink,
                haltList,
                list: baseFormLink.list === true,
              })

              headLinkName[readLinkName] = headLink
            } catch (kink) {
              saveHalt(haltList, kink)
            }
          }

          head.link[readName] = headLink
        } else if (baseFormLink.form) {
          const nestBaseForm = base.form[baseFormLink.form]
          haveFormMesh(nestBaseForm, formLinkLine)

          const headLink = makeFormTree({
            base,
            formLine: formLinkLine,
            readLine: readLinkLine,
            baseForm: nestBaseForm,
            readLink: readBase,
            haltList,
            list: baseFormLink.list === true,
          })

          head.link[readName] = headLink
        }
      } else if (testWave(readBase)) {
        haveRise(readBase, readLinkLine)
        head.link[readName] = { form: 'wave' }
      }
    } catch (kink) {
      saveHalt(haltList, kink)
    }
  }

  for (const readName in readLink.name) {
    try {
    } catch (kink) {
      saveHalt(haltList, kink)
    }
  }

  return head
}

function haveFormBond(
  find: unknown,
  call: string,
): asserts find is string {
  if (!find) {
    throw halt('link_form', { call })
  }
}
