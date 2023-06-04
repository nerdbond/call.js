import { Form, FormLink } from '@tunebond/form'
import {
  ComparisonOperatorExpression,
  DeleteQueryBuilder,
  DeleteResult,
  InsertObject,
  Kysely,
  OperandValueExpressionOrList,
  OrderByDirectionExpression,
  OrderByExpression,
  ReferenceExpression,
  SelectExpression,
  SelectQueryBuilder,
  SimpleReferenceExpression,
} from 'kysely'
import { ExtractTableAlias } from 'kysely/dist/cjs/parser/table-parser'

import { haveMesh, haveText, testMesh } from '@tunebond/have'

import halt from '../halt.js'
import {
  Base,
  LoadFind,
  LoadFindLikeBond,
  LoadFindLink,
  LoadFindTest,
  LoadRead,
  LoadSave,
  LoadSort,
  LoadTilt,
  MoldBase,
} from '../base.js'

export type FormBase<B extends Base> = B['form']

export type FormBond<
  B extends Base,
  N extends FormName<FormBase<B>>,
  I extends MoldBase<FormBase<B>> = MoldBase<FormBase<B>>,
> = OperandValueExpressionOrList<I, ExtractTableAlias<I, N>, N>

export type FormLikeLink<
  B extends Base,
  N extends FormName<FormBase<B>>,
  I extends MoldBase<FormBase<B>> = MoldBase<FormBase<B>>,
> = ReferenceExpression<I, ExtractTableAlias<I, N>>

export type FormName<T> = keyof OmitIndexSignature<T> & string

export type HoldKillCall<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = DeleteQueryBuilder<
  MoldBase<FormBase<B>>,
  ExtractTableAlias<MoldBase<FormBase<B>>, N>,
  DeleteResult
>

export type HoldReadCall<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = SelectQueryBuilder<
  MoldBase<FormBase<B>>,
  ExtractTableAlias<MoldBase<FormBase<B>>, N>,
  {}
>

export type HostName<T> = keyof T & string

export type Like<B extends Base, N extends FormName<FormBase<B>>> = {
  base: LikeBond<B, N>
  form: 'like'
  head: LikeBond<B, N> | LoadFindLikeBond
  test: ComparisonOperatorExpression
}

export type LikeBond<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  form: N
  name: FormBond<B, N>
  size?: boolean
}

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

export type Link = {
  base: LinkBond
  head: LinkBond
}

export type LinkBond = {
  form: string
  name: string
}

export type LinkMesh = Record<string, Link>

export type LoadLinkList<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  base: B
  line: string
  linkMesh: LinkMesh
  name: N
}

export type LoadReadLikeList<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  base: B
  find?: LoadFind
  linkMesh: LinkMesh
  name: N
}

export type LoadReadNameList<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  base: B
  name: N
  read: LoadRead
}

export type MakeKillBase<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  base: B
  find: LoadFind
  hold: Kysely<MoldBase<FormBase<B>>>
  linkMesh: LinkMesh
  name: N
  sort: Array<LoadSort>
}

export type MakeLinkList<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  name: N
  save: LoadSave
}

export type MakeMakeMeshBase<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  base: B
  hold: Kysely<MoldBase<FormBase<B>>>
  name: N
  read: LoadRead
  save: LoadSave
  sort: Array<LoadSort>
}

export type MakeMakeSeed<Name> = {
  name: Name
  save: LoadSave
}

export type MakeReadListBase<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = MakeReadMeshBase<B, N> & {
  curb?: number
  move?: number
}

export type MakeReadMeshBase<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  base: B
  find: LoadFind
  hold: Kysely<MoldBase<FormBase<B>>>
  name: N
  read: LoadRead
  sort: Array<LoadSort>
}

export type MakeSortList<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
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

export type ReadBase<B extends Base> = B['read']

export type ReadFormName<
  B extends Base,
  N extends FormName<FormBase<B>>,
  I extends MoldBase<FormBase<B>> = MoldBase<FormBase<B>>,
> = SelectExpression<I, ExtractTableAlias<I, N>>

export type ReadList<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  curb?: number
  find: LoadFind
  move?: number
  name: N
  read: LoadRead
  sort?: Array<LoadSort>
}

export type ReadMesh<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = {
  find: LoadFind
  name: N
  read: LoadRead
}

export type SaveBase<B extends Base> = B['save']

export type Sort<B extends Base, N extends FormName<FormBase<B>>> = {
  form: N
  name: SortName<B, N>
  tilt: OrderByDirectionExpression
}

export type SortKill<
  B extends Base,
  N extends FormName<FormBase<B>>,
  I extends MoldBase<FormBase<B>> = MoldBase<FormBase<B>>,
> = OrderByExpression<I, ExtractTableAlias<I, N>, DeleteResult>

export type SortName<
  B extends Base,
  N extends FormName<FormBase<B>>,
> = OrderByExpression<
  MoldBase<FormBase<B>>,
  ExtractTableAlias<MoldBase<FormBase<B>>, N>,
  {}
>

export type SortRead<
  B extends Base,
  N extends FormName<FormBase<B>>,
  I extends MoldBase<FormBase<B>> = MoldBase<FormBase<B>>,
> = OrderByExpression<I, ExtractTableAlias<I, N>, {}>

export const TILT: Record<LoadTilt, OrderByDirectionExpression> = {
  fall: 'desc',
  rise: 'asc',
}

export function bindKillLikeList<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(base: B, call: HoldKillCall<B, N>, likeList: Array<Like<B, N>>) {
  likeList.forEach(like => {
    if (testMesh(like.head)) {
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

export function bindKillLinkMesh<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(base: B, call: HoldKillCall<B, N>, linkMesh: LinkMesh) {
  for (const linkName in linkMesh) {
    const link = linkMesh[linkName]
    haveMesh(link, 'link')

    haveFormName(base, link.head.form)
    haveFormBond(base, link.head.form as N, link.head.name)
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

export function bindReadLikeList<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(base: B, call: HoldReadCall<B, N>, likeList: Array<Like<B, N>>) {
  likeList.forEach(like => {
    if (testMesh(like.head)) {
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

export function bindReadLinkMesh<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(base: B, call: HoldReadCall<B, N>, linkMesh: LinkMesh) {
  for (const linkName in linkMesh) {
    const link = linkMesh[linkName]
    haveMesh(link, 'link')

    haveFormName(base, link.head.form)
    haveFormBond(base, link.head.form as N, link.head.name)
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

export function haveBaseFormName<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(
  base: B,
  form: N,
  name: unknown,
): asserts name is SimpleReferenceExpression<
  MoldBase<FormBase<B>>,
  keyof MoldBase<FormBase<B>>
> {
  if (!base.form[form]?.link[name as string]) {
    throw new Error()
  }
}

export function haveForm(
  form: unknown,
  name: string,
): asserts form is Form {
  if (!form) {
    throw halt('form_miss', { name })
  }
}

export function haveFormBond<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(base: B, form: N, name: unknown): asserts name is FormBond<B, N> {
  if (!base.form[form]?.link[name as string]) {
    throw new Error(`Property ${name} undefined`)
  }
}

export function haveFormLink(
  link: unknown,
  name: string,
): asserts link is FormLink {
  if (!link) {
    throw halt('form_miss', { name })
  }
}

export function haveFormName<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(base: B, name: unknown): asserts name is N {
  if (!testFormName(base, name)) {
    throw halt('form_miss', { name: name as string })
  }
}

export function haveReadFormName<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(base: B, name: unknown): asserts name is ReadFormName<B, N> {
  if (!testFormName(base, name)) {
    throw new Error(`Property ${name} undefined`)
  }
}

export function haveSortName<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(name: unknown, nameList: object): asserts name is SortName<B, N> {
  if (!nameList.hasOwnProperty(name as string)) {
    throw new Error()
  }
}

export function loadLinkList<
  B extends Base,
  N extends FormName<FormBase<B>>,
>({ base, line, name, linkMesh }: LoadLinkList<B, N>) {
  const linkNameList: Array<string> = [name]

  let form = base.form[name]

  haveForm(form, name)

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
    haveMesh(form, 'form')

    const linkName = name_list[i++]
    haveText(linkName, 'linkName')

    const formLink: FormLink | undefined = form.link[linkName]
    haveFormLink(formLink, linkName)

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
          haveText(formLink.form, 'formLink.form')
          haveText(formLink.name, 'formLink.name')

          const link_form = base.form[formLink.form]
          haveMesh(link_form, 'link_form')

          const linkFormLink = link_form.link[formLink.name]
          haveMesh(linkFormLink, 'linkFormLink')

          link.base.name = 'code'
          link.head.form = formLink.form
          link.head.name = `${formLink.name}_code`
        } else if (formLink.code) {
          haveText(formLink.form, 'formLink.form')

          link.base.name = `${linkName}_code`
          link.head.form = formLink.form
          link.head.name = 'code'
        } else {
          throw new Error('unhandled')
          // if (test_list(formLink.form)) {
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

    haveText(formLink.form, 'formLink.form')

    if (formLink.list) {
      const linkName = name_list[i++]
      switch (linkName) {
        case 'list':
          form = base.form[formLink.form]
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
      form = base.form[formLink.form]
    }
  }

  throw new Error()
}

export function loadReadLikeList<
  B extends Base,
  N extends FormName<FormBase<B>>,
>({ name, find, base, linkMesh }: LoadReadLikeList<B, N>) {
  const likeList: Array<Like<B, N>> = []
  const form = base.form[name]
  haveMesh(form, 'form')

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
        const likeFormName = likeBase.name
        haveFormBond<B, N>(base, likeBaseForm as N, likeFormName)
        haveFormName<B, N>(base, likeBaseForm)

        if (testMesh(like.head) && like.head.link) {
          const likeHead = loadLinkList({
            base,
            line: like.head.link,
            linkMesh,
            name,
          })

          const likeHeadForm = likeHead.form
          const likeHeadName = likeHead.name
          haveFormName<B, N>(base, likeHeadForm)
          haveFormBond<B, N>(base, likeHeadForm as N, likeHeadName)

          likeList.push({
            base: { form: likeBaseForm, name: likeFormName },
            form: 'like',
            head: { form: likeHeadForm, name: likeHeadName },
            test: TEST[like.test],
          })
        } else if (!testMesh(like.head)) {
          likeList.push({
            base: { form: likeBaseForm, name: likeFormName },
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
  N extends FormName<FormBase<B>>,
>({ name, read, base }: LoadReadNameList<B, N>) {
  const list: Array<ReadFormName<B, N>> = []
  const form = base.form[name]
  haveForm(form, name)

  for (const name in read) {
    if (form.link[name]) {
      haveReadFormName<B, N>(base, name)

      list.push(name)
    }
  }

  return list
}

export async function makeKillBase<
  B extends Base,
  N extends FormName<FormBase<B>>,
>({ name, find, base, hold, sort }: MakeKillBase<B, N>) {
  const linkMesh: Record<string, Link> = {}
  const likeList = loadReadLikeList({
    base,
    find,
    linkMesh,
    name,
  })
  const sortList = makeSortList({ base, linkMesh, name, sort })

  let call = hold.deleteFrom(name)
  call = bindKillLinkMesh(base, call, linkMesh)
  call = bindKillLikeList(base, call, likeList)

  sortList.forEach(sort => {
    call = call.orderBy(
      `${sort.form}.${sort.name}` as SortKill<B, N>,
      sort.tilt,
    )
  })

  const mesh = await call.executeTakeFirst()

  return mesh
}

export async function makeMakeMeshBase<
  B extends Base,
  N extends FormName<FormBase<B>>,
>({ name, base, hold, read, save }: MakeMakeMeshBase<B, N>) {
  const saveMesh: Record<string, unknown> = {}
  const form = base.form[name]
  haveForm(form, name)

  for (const saveName in save) {
    const saveBond = save[saveName]
    if (form.link[saveName]) {
      if (Array.isArray(saveBond)) {
      } else if (testMesh(saveBond)) {
        saveMesh[saveName] = saveBond.save
      } else {
        saveMesh[saveName] = saveBond
      }
    }
  }

  let call = hold
    .insertInto(name)
    .values(saveMesh as InsertObject<MoldBase<FormBase<B>>, N>)

  const mesh = await call.execute()

  return mesh
}

export async function makeReadList<
  B extends Base,
  N extends FormName<FormBase<B>>,
>({
  name,
  find,
  base,
  hold,
  read,
  sort,
  curb,
  move,
}: MakeReadListBase<B, N>) {
  const { list, size } = await makeReadListBase<B, N>({
    base,
    curb,
    find,
    hold,
    move,
    name,
    read,
    sort,
  })

  console.log(list, size)
}

export async function makeReadListBase<
  B extends Base,
  N extends FormName<FormBase<B>>,
>({
  name,
  find,
  base,
  hold,
  read,
  sort,
  curb,
  move,
}: MakeReadListBase<B, N>) {
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
  call = bindReadLinkMesh(base, call, linkMesh)
  call = bindReadLikeList(base, call, likeList)

  const { count } = hold.fn

  const form = base.form[name]
  haveMesh(form, 'form')

  haveBaseFormName(base, name, form.dock)

  const { size } = (await call
    .select([count(form.dock).as('size')])
    .executeTakeFirst()) ?? { size: 0 }

  call = call.select(nameList)

  sortList.forEach(sort => {
    call = call.orderBy(
      `${sort.form}.${sort.name}` as SortRead<B, N>,
      sort.tilt,
    )
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

export async function makeReadMeshBase<
  B extends Base,
  N extends FormName<FormBase<B>>,
>({ name, find, base, hold, read, sort }: MakeReadMeshBase<B, N>) {
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
  call = bindReadLinkMesh(base, call, linkMesh)
  call = bindReadLikeList(base, call, likeList)

  call = call.select(nameList)

  sortList.forEach(sort => {
    call = call.orderBy(
      `${sort.form}.${sort.name}` as SortRead<B, N>,
      sort.tilt,
    )
  })

  const mesh = await call.executeTakeFirst()

  return mesh
}

export function makeSortList<
  B extends Base,
  N extends FormName<FormBase<B>>,
>({ name, sort, base, linkMesh }: MakeSortList<B, N>) {
  const sortList: Array<Sort<B, N>> = []
  const form = base.form[name]
  haveMesh(form, name)

  sort.forEach(baseSort => {
    const link = loadLinkList({
      base,
      line: baseSort.link,
      linkMesh,
      name,
    })

    haveFormName<B, N>(base, link.form)
    haveSortName<B, N>(link.name, form)

    sortList.push({
      form: link.form,
      name: link.name,
      tilt: TILT[baseSort.tilt],
    })
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

export function testFormName<
  B extends Base,
  N extends FormName<FormBase<B>>,
>(base: B, name: unknown): name is N {
  return Boolean(base.form[name as string])
}

export function testLinkForm<N>(
  link: unknown,
  formList: Array<string>,
): link is N {
  const form = readBaseLinkForm(link)
  return formList.includes(form)
}
