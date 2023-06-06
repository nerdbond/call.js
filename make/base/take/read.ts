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
import { Base, ReadTakeBase, ReadTakeBaseLink } from '~/base/index.js'
import { haveFormMesh, testFormMesh } from '~/call/have.js'
import halt from '~/halt.js'
import {
  LOAD_FIND_TEST,
  LoadFind,
  LoadFindBind,
  LoadFindLike,
  LoadFindRoll,
} from '~/call/load.js'
import { ReadTakeTree } from '~/base/read'

export function haveRise(
  wave: unknown,
  call: string,
): asserts wave is true {
  if (wave !== true) {
    throw halt('link_need', { call })
  }
}

/**
 * This file makes the read take validator.
 */

export default function make(base: Base, haltList: Array<HaltMesh>) {
  const head = makeReadTakeTreeBase({
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

export type MakeReadTakeTreeBase = {
  base: Base
  haltList: Array<HaltMesh>
  formLine: string
  readLine: string
}

export function makeReadTakeTreeBase({
  base,
  haltList,
  formLine,
  readLine,
}: MakeReadTakeTreeBase) {
  const head: ReadTakeTree = {
    like: 'read-take-tree',
    link: {},
    name: {},
  }

  for (const name in base.read) {
    const readLink = base.read[name]
    const baseForm = base.form[name]

    try {
      const formNameLine = `${formLine}.${name}`
      haveFormMesh(baseForm, formNameLine)

      const readNameLine = `${readLine}.${name}`
      haveMesh(readLink, readNameLine)

      const link = makeReadTakeTree({
        base,
        formLine: formNameLine,
        readLine: readNameLine,
        readLink,
        baseForm,
        haltList,
        list: true,
        head,
      })

      head.link[name] = link
    } catch (kink) {
      saveHalt(haltList, kink)
    }
  }
}

export type MakeReadTakeTree = {
  base: Base
  formLine: string
  readLine: string
  readLink: ReadTakeBaseLink
  baseForm: FormMesh
  haltList: Array<HaltMesh>
  list?: boolean
}

export function makeReadTakeTree({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
  list = false,
}: MakeReadTakeTree) {
  if (list) {
    return makeReadTakeTreeList({
      base,
      formLine,
      readLine,
      readLink,
      baseForm,
      haltList,
    })
  } else {
    return makeReadTakeTreeMesh({
      base,
      formLine,
      readLine,
      readLink,
      baseForm,
      haltList,
    })
  }
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
    const headForm = makeReadTakeTree({
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

export type MakeReadTakeTreeList = {
  base: Base
  formLine: string
  readLine: string
  readLink: ReadTakeBaseLink
  baseForm: FormMesh
  haltList: Array<HaltMesh>
}

export function makeReadTakeTreeList({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
}: MakeReadTakeTreeList) {
  const head: ReadTakeTree = {
    like: 'read-take-tree',
    link: {},
    name: {},
  }

  for (const readLinkName in readLink.read) {
    const lead = readLink.read[readLinkName]
    const formLinkLine = `${formLine}`
    const readLinkLine = `${readLine}.${readLinkName}`
    switch (readLinkName) {
      case 'size':
        haveRise(lead, readLinkLine)
        head.link.size = {
          like: 'read-take-tree-leaf',
          form: 'mark',
        }
        break
      case 'list':
        haveMesh(lead, readLinkLine)

        const link = makeReadTakeTree({
          base,
          formLine: formLinkLine,
          readLine: readLinkLine,
          readLink: lead,
          baseForm,
          haltList,
        })

        head.link.list = link
        linkBind(link, head)

        break
      default:
        throw halt('link_miss', { call: readLinkLine })
    }
  }

  return head
}

export type MakeReadTakeTreeMesh = {
  base: Base
  formLine: string
  readLine: string
  readLink: ReadTakeBaseLink
  baseForm: FormMesh
  haltList: Array<HaltMesh>
}

export function makeReadTakeTreeMesh({
  base,
  formLine,
  readLine,
  readLink,
  baseForm,
  haltList,
}: MakeReadTakeTreeMesh) {
  const head: ReadTakeTree = {
    like: 'read-take-tree',
    link: {},
    name: {},
  }

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
          const nameTree: ReadTakeTree = {
            like: 'read-take-tree',
            link: {},
            name: {},
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const nameTreeName = nameTree.name
          haveMesh(nameTreeName, 'nameTreeName')

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

              const link = makeReadTakeTree({
                base,
                formLine: formLinkLine,
                readLine: readLinkLine,
                baseForm: nestBaseForm,
                readLink,
                haltList,
                list: baseFormLink.list === true,
              })

              nameTreeName[readLinkName] = link

              linkBind(link, nameTree)
            } catch (kink) {
              saveHalt(haltList, kink)
            }
          }
          head.link[readName] = nameTree
          linkBind(nameTree, head)
        } else if (baseFormLink.form) {
          const nestBaseForm = base.form[baseFormLink.form]
          haveFormMesh(nestBaseForm, formLinkLine)

          const link = makeReadTakeTree({
            base,
            formLine: formLinkLine,
            readLine: readLinkLine,
            baseForm: nestBaseForm,
            readLink: readBase,
            haltList,
            list: baseFormLink.list === true,
          })

          head.link[readName] = link
          linkBind(link, head)
        }
      } else if (testWave(readBase)) {
        haveRise(readBase, readLinkLine)
        haveText(baseFormLink.form, 'baseFormLink.form')

        head.link[readName] = {
          like: 'read-take-tree-leaf',
          form: baseFormLink.form,
        }
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
