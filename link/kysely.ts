import {
  AnyColumn,
  ComparisonOperatorExpression,
  InsertObject,
  JoinReferenceExpression,
  Kysely,
  OperandValueExpressionOrList,
  OrderByDirectionExpression,
  OrderByExpression,
  ReferenceExpression,
  SelectQueryBuilder,
  Selection,
  SimpleReferenceExpression,
} from 'kysely'
import { ExtractTableAlias } from 'kysely/dist/cjs/parser/table-parser'
import { seekMesh, testMesh, testText } from 'make.js'

import { Base, BaseForm } from '@tunebond/form'

import {
  InterpolateForm,
  LoadFind,
  LoadFindLikeBond,
  LoadFindLink,
  LoadFindTest,
  LoadRead,
  LoadSave,
  LoadSort,
  LoadTilt,
} from '../index.js'

export type BaseName<T> = keyof OmitIndexSignature<T> & string

export type HoldCall<
  B extends Base,
  N extends BaseName<B>,
> = SelectQueryBuilder<
  InterpolateForm<B>,
  ExtractTableAlias<InterpolateForm<B>, N>,
  {}
>

export type HostName<T> = keyof T & string

const TEST: Record<LoadFindTest, ComparisonOperatorExpression> = {
  base_link_mark: '>=',
  base_mark: '>',
  // base_text: '%like',
  bond: '=',
  have_bond: 'in',
  have_text: 'like',
  head_link_mark: '<=',
  head_mark: '<',
  // head_text: 'like%',
  miss_bond: '!=',
}

export const TILT: Record<LoadTilt, OrderByDirectionExpression> = {
  fall: 'desc',
  rise: 'asc',
}

// eslint-disable-next-line sort-exports/sort-exports
export type FormBond<
  B extends Base,
  N extends BaseName<B>,
  I extends InterpolateForm<B> = InterpolateForm<B>,
> = OperandValueExpressionOrList<
  I,
  ExtractTableAlias<I, N>,
  FormName<B, N>
>

export type FormLikeLink<
  B extends Base,
  N extends BaseName<B>,
> = ReferenceExpression<
  InterpolateForm<B>,
  ExtractTableAlias<InterpolateForm<B>, N>
>

export type FormLink<
  B extends Base,
  N extends BaseName<B>,
  I extends InterpolateForm<B> = InterpolateForm<B>,
> = JoinReferenceExpression<
  InterpolateForm<B>,
  ExtractTableAlias<InterpolateForm<B>, N>,
  FormName<B, BaseName<B>, InterpolateForm<B>>
>

export type FormName<
  B extends Base,
  N extends BaseName<B>,
  I extends InterpolateForm<B> = InterpolateForm<B>,
> = AnyColumn<I, ExtractTableAlias<I, N>>

export type Like<B extends Base, N extends BaseName<B>> = {
  base: LikeBond<B, N>
  form: 'like'
  head: LikeBond<B, N> | LoadFindLikeBond
  test: ComparisonOperatorExpression
}

export type LikeBond<B extends Base, N extends BaseName<B>> = {
  form: FormName<B, N>
  name: FormBond<B, N>
  size?: boolean
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

export type LoadReadNameList<B extends Base, N extends BaseName<B>> = {
  base: B
  name: N
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

export type MakeReadList<
  B extends Base,
  N extends BaseName<B>,
> = MakeReadMesh<B, N> & {
  curb?: number
  move?: number
}

export type MakeReadMesh<B extends Base, N extends BaseName<B>> = {
  base: B
  find: LoadFind
  hold: Kysely<InterpolateForm<B>>
  linkMesh: LinkMesh
  name: N
  read: LoadRead
  sort: Array<LoadSort>
}

export type MakeSortList<B extends Base, N extends BaseName<B>> = {
  base: B
  linkMesh: LinkMesh
  name: N
  sort: Array<LoadSort>
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
  InterpolateForm<B>,
  ExtractTableAlias<InterpolateForm<B>, N>,
  {}
>

export function bindLikeList<B extends Base, N extends BaseName<B>>(
  base: B,
  call: HoldCall<B, N>,
  likeList: Array<Like<B, N>>,
) {
  likeList.forEach(like => {
    if (seekMesh(like.head)) {
      call = call.where(
        `${like.base.form}.${like.base.name}` as FormLikeLink<B, N>,
        like.test,
        `${like.head.form}.${like.head.name}` as FormLikeLink<B, N>,
      )
    } else {
      call = call.where(
        `${like.base.form}.${like.base.name}` as FormLikeLink<B, N>,
        like.test,
        like.head,
      )
    }
  })

  return call
}

export function bindLinkMesh<B extends Base, N extends BaseName<B>>(
  base: B,
  call: HoldCall<B, N>,
  linkMesh: LinkMesh,
) {
  for (const linkName in linkMesh) {
    const link = linkMesh[linkName]
    testMesh(link)

    testFormName(base, link.head.form)
    testFormBond(base, link.head.form as N, link.head.name)
    call = call.innerJoin(
      link.head.form,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      `${link.head.form}.${link.head.name}` as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      `${link.base.form}.${link.base.name}` as any,
    )
  }
  return call
}

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

export function loadReadNameList<
  B extends Base,
  N extends BaseName<B>,
>({ name, read, base }: LoadReadNameList<B, N>) {
  const list: Array<FormName<B, N>> = []
  const form = base[name]
  testMesh(form)

  for (const name in read) {
    if (form.link[name]) {
      testFormName<B, N>(base, name)

      list.push(name)
    }
  }

  return list
}

export async function makeReadList<
  B extends Base,
  N extends BaseName<B>,
>({
  name,
  find,
  base,
  hold,
  read,
  sort,
  curb,
  move,
}: MakeReadList<B, N>) {
  const linkMesh: Record<string, Link> = {}
  const likeList = loadReadLikeList({
    base,
    find,
    linkMesh,
    name,
  })
  const sortList = makeSortList({ base, linkMesh, name, sort })

  const nameList = loadReadNameList({ base, name, read })

  let call = hold.selectFrom(name)
  call = bindLinkMesh(base, call, linkMesh)
  call = bindLikeList(base, call, likeList)

  const { count } = hold.fn

  const form = base[name]
  testMesh(form)

  testBaseFormName(base, name, form.dock)

  const { size } = (await call
    .select([count(form.dock).as('size')])
    .executeTakeFirst()) ?? { size: 0 }

  call = call.select(nameList)

  sortList.forEach(sort => {
    call = call.orderBy(sort.name, sort.tilt)
  })

  if (curb) {
    call = call.limit(curb)
  }

  if (move) {
    call = call.offset(move)
  }

  const list = await call.execute()

  return { list, size }
}

export async function makeReadMesh<
  B extends Base,
  N extends BaseName<B>,
>({ name, find, base, hold, read, sort }: MakeReadMesh<B, N>) {
  const linkMesh: Record<string, Link> = {}
  const likeList = loadReadLikeList({
    base,
    find,
    linkMesh,
    name,
  })
  const sortList = makeSortList({ base, linkMesh, name, sort })

  const nameList = loadReadNameList({ base, name, read })

  let call = hold.selectFrom(name)
  call = bindLinkMesh(base, call, linkMesh)
  call = bindLikeList(base, call, likeList)

  call = call.select(nameList)

  sortList.forEach(sort => {
    call = call.orderBy(sort.name, sort.tilt)
  })

  const mesh = await call.executeTakeFirst()

  return mesh
}

export function makeSortList<B extends Base, N extends BaseName<B>>({
  name,
  sort,
  base,
  linkMesh,
}: MakeSortList<B, N>) {
  const sortList: Array<Sort<B, N>> = []
  const form = base[name]
  testMesh(form)

  sort.forEach(baseSort => {
    const baseName = baseSort.name
    if (seekSortName<SortName<B, N>>(baseName, form)) {
      sortList.push({
        name: baseName,
        tilt: TILT[baseSort.tilt],
      })
    } else {
      // if long
      // linkMesh
    }
  })

  return sortList
}

export function readBaseLinkForm(blob: unknown) {
  const form = typeof blob
  switch (form) {
    case 'string':
      return 'text'
    case 'number':
      return 'mark'
    case 'undefined':
      return 'void'
    default:
      if (blob == null) {
        return 'void'
      } else {
        return 'mesh'
      }
  }
}

export function seekFormName<
  B extends Base,
  N extends BaseName<B> = BaseName<B>,
>(base: B, name: unknown): name is FormName<B, N> {
  return Boolean(base[name as string])
}

export function seekLinkForm<N>(
  link: unknown,
  form_list: Array<string>,
): link is N {
  const form = readBaseLinkForm(link)
  return form_list.includes(form)
}

export function seekSortName<Name>(
  name: unknown,
  nameList: object,
): name is Name {
  return nameList.hasOwnProperty(name as string)
}

export function testBaseFormName<B extends Base, N extends BaseName<B>>(
  base: B,
  form: N,
  name: unknown,
): asserts name is SimpleReferenceExpression<
  InterpolateForm<B>,
  keyof InterpolateForm<B>
> {
  if (!base[form]?.link[name as string]) {
    throw new Error()
  }
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
  if (!seekFormName(base, name)) {
    throw new Error(`Property ${name} undefined`)
  }
}
