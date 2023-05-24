import {
  AnyColumn,
  InsertObject,
  OperandValueExpressionOrList,
  OrderByDirectionExpression,
  OrderByExpression,
  Selection,
} from 'kysely'
import { ExtractTableAlias } from 'kysely/dist/cjs/parser/table-parser'
import { seekMesh, testMesh, testText } from 'make.js'

import { Base, BaseForm } from '@tunebond/form'

import {
  LoadFind,
  LoadFindLikeBond,
  LoadFindLink,
  LoadFindTest,
  LoadRead,
  LoadSave,
  LoadSort,
} from '../index.js'

export type BaseName<T> = keyof OmitIndexSignature<T> & string
export type HostName<T> = keyof T & string

const TEST: Record<LoadFindTest, LikeTest> = {
  base_link_mark: '>=',
  base_mark: '>',
  base_text: '%like',
  bond: '=',
  have_bond: 'in',
  have_text: '%like%',
  head_link_mark: '<=',
  head_mark: '<',
  head_text: 'like%',
  miss_bond: '!=',
}

export const TILT: Record<string, OrderByDirectionExpression> = {
  fall: 'desc',
  rise: 'asc',
}

// eslint-disable-next-line sort-exports/sort-exports
export type FormBond<
  B extends Base,
  N extends BaseName<B>,
> = OperandValueExpressionOrList<
  B,
  ExtractTableAlias<B, N>,
  FormName<B, N>
>

export type FormName<B extends Base, N extends BaseName<B>> = AnyColumn<
  B,
  ExtractTableAlias<B, N>
>

export type Like<B extends Base, N extends BaseName<B>> = {
  base: {
    form: FormName<B, N>
    name: FormBond<B, N>
    size?: boolean
  }
  form: 'like'
  head:
    | {
        form: FormName<B, N>
        name: FormBond<B, N>
        size?: boolean
      }
    | LoadFindLikeBond
  test: LikeTest
}

export type LikeTest =
  | '='
  | '>='
  | '>'
  | '<'
  | '<='
  | '!='
  | '%like'
  | 'like%'
  | '%like%'
  | 'in'

export type Link = {
  base: LinkBond
  head: LinkBond
}

export type LinkBond = {
  form: string
  name: string
}

export type LinkMesh = Record<string, Link>

export type LoadLinkList<B extends Base, N extends BaseName<B>> = {
  base: B
  line: string
  linkMesh: LinkMesh
  name: N
}

export type LoadReadLikeList<B extends Base, N extends BaseName<B>> = {
  base: B
  find?: LoadFind
  linkMesh: LinkMesh
  name: N
}

export type LoadReadNameList<
  B extends Base,
  Name extends BaseName<B>,
> = {
  base: Base
  name: Name
  read: LoadRead
}

export type MakeLinkList<B extends Base, N extends BaseName<B>> = {
  name: N
  save: LoadSave
}

export type MakeMakeSeed<Name> = {
  name: Name
  save: LoadSave
}

export type MakeRead<B extends Base, N extends BaseName<B>> = {
  base: B
  find: LoadFind
  linkMesh: LinkMesh
  name: N
  read: LoadRead
}

export type OmitIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? never
    : KeyType]: ObjectType[KeyType]
}

export type ReadList<B extends Base, N extends BaseName<B>> = {
  curb?: number
  find: LoadFind
  move?: number
  name: N
  read: LoadRead
  sort?: Array<LoadSort>
}

export type ReadMesh<B extends Base, N extends BaseName<B>> = {
  find: LoadFind
  name: N
  read: LoadRead
}

export type Sort<B extends Base, N extends BaseName<B>> = {
  name: SortName<B, N>
  tilt: OrderByDirectionExpression
}

export type SortName<
  B extends Base,
  N extends BaseName<B>,
> = OrderByExpression<
  B,
  ExtractTableAlias<B, N>,
  Selection<B, ExtractTableAlias<B, N>, FormName<B, N>>
>

export function loadLinkList<B extends Base, N extends BaseName<B>>({
  base,
  line,
  name,
  linkMesh,
}: LoadLinkList<B, N>) {
  const linkNameList: Array<string> = [name]

  let form: BaseForm | undefined = base[name]

  let link: Link = {
    base: {
      form: name,
      name: '',
    },
    head: {
      form: '',
      name: '',
    },
  }

  let name_list = line.split('/')
  let i = 0

  while (i < name_list.length) {
    testMesh(form)

    const linkName = name_list[i++]
    testText(linkName)

    const formLink = form.link[linkName]

    if (!formLink) {
      throw new Error(`Property ${linkName} undefined`)
    }

    switch (formLink.form) {
      case 'wave':
      case 'text':
      case 'mark':
      case 'date':
      case 'code':
        // return property to do condition at
        return {
          form: link.base.form,
          name: linkName,
        }
      default:
        linkNameList.push(linkName)
        const hook = linkNameList.join(':')

        if (formLink.list) {
          testText(formLink.form)
          testText(formLink.name)

          const link_form = base[formLink.form]
          testMesh(link_form)

          const linkFormLink = link_form.link[formLink.name]
          testMesh(linkFormLink)

          link.base.name = 'code'
          link.head.form = formLink.form
          link.head.name = `${formLink.name}_code`
        } else if (formLink.code) {
          testText(formLink.form)

          link.base.name = `${linkName}_code`
          link.head.form = formLink.form
          link.head.name = 'code'
        } else {
          throw new Error('unhandled')
          // if (seek_list(formLink.form)) {
          //   formLink.form.forEach(form => {
          //   })
          // }
        }

        linkMesh[hook] = link

        link = {
          base: {
            form: link.head.form,
            name: '',
          },
          head: {
            form: '',
            name: '',
          },
        }

        break
    }

    testText(formLink.form)

    if (formLink.list) {
      const linkName = name_list[i++]
      switch (linkName) {
        case 'list':
          form = base[formLink.form]
          break
        case 'size': // not used in this question, but used in my code
          return {
            form: link.base.form,
            name: linkName,
            size: true,
          }
        default:
          throw new Error('Unknown list property')
      }
    } else {
      form = base[formLink.form]
    }
  }

  throw new Error()
}

export function loadReadLikeList<
  B extends Base,
  N extends BaseName<B>,
>({ name, find, base, linkMesh }: LoadReadLikeList<B, N>) {
  const likeList: Array<Like<B, N>> = []
  const form = base[name]
  testMesh(form)

  const findLikeList: Array<LoadFindLink> = Array.isArray(find)
    ? find
    : find
    ? [find]
    : []

  findLikeList.forEach(like => {
    switch (like.form) {
      case 'like':
        const likeBase = loadLinkList({
          base,
          line: like.base.link,
          linkMesh,
          name,
        })

        const likeBaseForm = likeBase.form
        const likeBaseName = likeBase.name
        testFormBond<B, N>(base, likeBaseForm as N, likeBaseName)
        testFormName<B, N>(base, likeBaseForm)

        if (seekMesh(like.head) && like.head.link) {
          const likeHead = loadLinkList({
            base,
            line: like.head.link,
            linkMesh,
            name,
          })

          const likeHeadForm = likeHead.form
          const likeHeadName = likeHead.name
          testFormName<B, N>(base, likeHeadForm)
          testFormBond<B, N>(base, likeHeadForm as N, likeHeadName)

          likeList.push({
            base: { form: likeBaseForm, name: likeBaseName },
            form: 'like',
            head: { form: likeHeadForm, name: likeHeadName },
            test: TEST[like.test],
          })
        } else if (!seekMesh(like.head)) {
          likeList.push({
            base: { form: likeBaseForm, name: likeBaseName },
            form: 'like',
            head: like.head,
            test: TEST[like.test],
          })
        }
        break
      default:
        throw new Error('TODO')
        break
    }
  })

  return likeList
}

export function makeRead<B extends Base, N extends BaseName<B>>({
  name,
  find,
  base,
}: MakeRead<B, N>) {
  const linkMesh: Record<string, Link> = {}
  const likeList = loadReadLikeList({
    base,
    find,
    linkMesh,
    name,
  })
}

export function seekLinkForm<N>(
  link: unknown,
  form_list: Array<string>,
): link is N {
  const form = readBaseLinkForm(link)
  return form_list.includes(form)
}

export function testFormBond<
  B extends Base,
  N extends BaseName<B> = BaseName<B>,
>(base: B, form: N, name: unknown): asserts name is FormBond<B, N> {
  if (!base[form]?.link[name as string]) {
    throw new Error(`Property ${name} undefined`)
  }
}

export function testFormName<
  B extends Base,
  N extends BaseName<B> = BaseName<B>,
>(base: B, name: unknown): asserts name is FormName<B, N> {
  if (!base[name as string]) {
    throw new Error(`Property ${name} undefined`)
  }
}
