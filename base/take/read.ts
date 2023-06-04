import { Form, FormMesh, FormTree } from '@tunebond/form'
import { HaltMesh, saveHalt } from '@tunebond/halt'
import {
  haveBindList,
  haveMesh,
  haveText,
  seekMark,
  seekText,
  seekWave,
  testMesh,
  testWave,
} from '@tunebond/have'
import {
  Base,
  ReadTakeBase,
  ReadTakeBaseLink,
} from '../../base/index.js'
import { haveFormMesh, testFormMesh } from '../../call/have.js'
import halt from '../../halt.js'
import {
  LOAD_FIND_TEST,
  LoadFind,
  LoadFindBind,
  LoadFindLike,
  LoadFindRoll,
} from '~/call/load.js'

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
        head,
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
          head: form,
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
  head: FormTree
}

export function makeFormTree({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
  head,
  list = false,
}: BindFormTree) {
  const leadForm: FormTree = {
    link: {},
  }
  haveMesh(leadForm.link, 'leadForm.link')

  leadForm.link.find = { hook: makeFind }

  // linkBind(leadForm, head)
  linkBind(leadForm.link.find, leadForm)

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

  linkBind(leadForm.link.read, leadForm)

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

              const headLinkTree = makeFormTree({
                base,
                formLine: formLinkLine,
                readLine: readLinkLine,
                baseForm: nestBaseForm,
                readLink,
                haltList,
                list: baseFormLink.list === true,
                head: headLink,
              })

              headLinkName[readLinkName] = headLinkTree
            } catch (kink) {
              saveHalt(haltList, kink)
            }
          }

          linkBind(headLink, head)

          head.link[readName] = headLink
        } else if (baseFormLink.form) {
          const nestBaseForm = base.form[baseFormLink.form]
          haveFormMesh(nestBaseForm, formLinkLine)

          const headLinkTree = makeFormTree({
            base,
            formLine: formLinkLine,
            readLine: readLinkLine,
            baseForm: nestBaseForm,
            readLink: readBase,
            haltList,
            list: baseFormLink.list === true,
            head,
          })

          head.link[readName] = headLinkTree
        }
      } else if (testWave(readBase)) {
        haveRise(readBase, readLinkLine)
        head.link[readName] = { form: 'wave' }
      }
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

export function makeFind(
  find: LoadFind,
  tree: FormTree,
  leadLine: string,
  treeLine: string,
) {
  switch (find.form) {
    case 'like':
      return makeFindLike(find, tree, leadLine, treeLine)
    case 'roll':
      return makeFindRoll(find, tree, leadLine, treeLine)
    case 'bind':
      return makeFindBind(find, tree, leadLine, treeLine)
    default:
      throw halt('link_take', { need: ['like', 'roll', 'bind'] })
  }
}

export function makeFindRoll(
  find: LoadFindRoll,
  tree: FormTree,
  leadLine: string,
  treeLine: string,
) {
  for (const link of find.list) {
    makeFind(link, tree, leadLine, treeLine)
  }
}

export function makeFindBind(
  find: LoadFindBind,
  tree: FormTree,
  leadLine: string,
  treeLine: string,
) {
  for (const link of find.list) {
    makeFind(link, tree, leadLine, treeLine)
  }
}

export function makeFindLike(
  find: LoadFindLike,
  tree: FormTree,
  leadLine: string,
  treeLine: string,
) {
  const { lead, line } = findFindLinkCall(
    find.base.link,
    tree,
    leadLine,
    treeLine,
  )
  haveMesh(lead, line.join('.'))
  haveBindList(find.test, LOAD_FIND_TEST, 'find.test')

  if (testMesh(find.head)) {
    const { lead, line } = findFindLinkCall(
      find.head.link,
      tree,
      leadLine,
      treeLine,
    )
    haveMesh(lead, line.join('.'))
  } else {
    // match to value type according to the linked type
    switch (lead.form) {
      case 'text':
        seekText(find.head, true, 'find.head')
        break
      case 'mark':
        seekMark(find.head, true, 'find.head')
        break
      case 'wave':
        seekWave(find.head, true, 'find.head')
        break
      default:
        break
    }
  }
}

export function findFindLinkCall(
  link: string,
  tree: FormTree,
  leadLine: string,
  treeLine: string,
) {
  const linkLine = link.split('/')
  let i = 0
  let leadTree = tree
  const findLeadLine: Array<string> = [leadLine]
  const findTreeLine: Array<string> = [treeLine]
  while (i < linkLine.length) {
    haveMesh(leadTree.link, findLeadLine.join('.'))
    const name = linkLine[i++]
    haveText(name, 'name')
    findTreeLine.push(`${name}`)
    const readLead = leadTree.link.read
    findLeadLine.push(`read`)
    haveMesh(readLead, findLeadLine.join('.'))
    findLeadLine.push(`link`)
    haveMesh(readLead.link, findLeadLine.join('.'))

    const leadLink = readLead.link[name]

    if (!leadLink) {
      return { line: findTreeLine }
    }

    leadTree = leadLink
  }

  return { lead, line: findTreeLine }
}

export function makeLink(
  mesh: Record<string, unknown>,
  name: string,
  lead: unknown,
) {
  Object.defineProperty(mesh, name, {
    enumerable: false,
    value: lead,
  })
}

export function linkBind(head: FormTree, base: FormTree) {
  makeLink(head, 'bind', base)
}
