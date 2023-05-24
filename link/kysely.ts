import {
  AnyColumn,
  InsertObject,
  OperandValueExpressionOrList,
  OrderByDirectionExpression,
  OrderByExpression,
  Selection,
} from 'kysely'
import { ExtractTableAlias } from 'kysely/dist/cjs/parser/table-parser'
import { testMesh, testText } from 'make.js'

import { BaseForm, Base as BaseHold } from '@tunebond/form'

import {
  LoadFind,
  LoadFindLink,
  LoadRead,
  LoadSave,
  LoadSort,
} from '../index.js'

type BaseName<T> = keyof OmitIndexSignature<T> & string

class Tool<Base extends BaseHold, HookBase, NameBase extends string> {
  base: Base

  nameBase: string

  constructor(base: Base, hook: HookBase, nameBase: NameBase) {
    this.base = base
    this.nameBase = nameBase
  }

  makeRead<Name extends BaseName<Base>>(name: Name) {}

  makeLinkList<Name extends BaseName<Base>>({
    name,
    save,
  }: MakeLinkList<Base, Name>) {}

  loadLinkList<Name extends BaseName<Base>>({
    line,
    name,
    linkMesh,
  }: LoadLinkList<Base, Name>) {
    const link_name_list: Array<string> = [name]

    let form = this.base[name]

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

      const link_name = name_list[i++]
      testText(link_name)

      const form_link = form.link[link_name]

      if (!form_link) {
        throw new Error(`Property ${link_name} undefined`)
      }

      switch (form_link.form) {
        case 'wave':
        case 'text':
        case 'mark':
        case 'date':
        case 'code':
          // return property to do condition at
          return {
            form: link.base.form,
            name: link_name,
          }
        default:
          link_name_list.push(link_name)
          const hook = link_name_list.join(':')

          if (form_link.list) {
            testText(form_link.form)
            testText(form_link.name)

            const link_form = this.base[form_link.form]
            testMesh(link_form)

            const link_form_link = link_form.link[form_link.name]
            testMesh(link_form_link)

            link.base.name = 'code'
            link.head.form = form_link.form
            link.head.name = `${form_link.name}_code`
          } else if (form_link.code) {
            testText(form_link.form)

            link.base.name = `${link_name}_code`
            link.head.form = form_link.form
            link.head.name = 'code'
          } else {
            throw new Error('unhandled')
            // if (seek_list(form_link.form)) {
            //   form_link.form.forEach(form => {
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

      testText(form_link.form)

      if (form_link.list) {
        const link_name = name_list[i++]
        switch (link_name) {
          case 'list':
          case 'size': // not used in this question, but used in my code
            form = this.base[form_link.form]
            break
          default:
            throw new Error('Unknown list property')
        }
      } else {
        const f = this.base[form_link.form]
        testMesh(f)
        form = f
      }
    }

    return linkMesh
  }

  loadReadLikeList<Name extends BaseName<Base>>({
    name,
    find,
    seek,
    linkMesh,
  }: LoadReadLikeList<Base, Name>) {
    const like_list: Array<Like<Base, Name>> = []
    const form = this.base[name]
    const find_like_list: Array<LoadFindLink> = Array.isArray(find)
      ? find
      : find
      ? [find]
      : []

    find_like_list.forEach(like => {
      switch (like.form) {
        case 'like':
          this.loadLinkList({
            line: like.base.link,
            linkMesh,
            name,
          })
          break
        default:
          break
      }
    })

    // for (const name in find) {
    //   const form_list = form[name]

    //   if (!form_list) {
    //     continue
    //   }

    //   if (!seek(name)) {
    //     continue
    //   }

    //   const link = find[name]

    //   if (!seek_link_form<FormBond<Name>>(link, form_list)) {
    //     continue
    //   }

    //   list.push({
    //     link,
    //     name,
    //     test: '=',
    //   })
    // }

    return like_list
  }
}

export const TILT: Record<string, OrderByDirectionExpression> = {
  fall: 'desc',
  rise: 'asc',
}

// eslint-disable-next-line sort-exports/sort-exports
export type FormBond<
  HoldBase,
  Name extends keyof HoldBase,
> = OperandValueExpressionOrList<
  HoldBase,
  ExtractTableAlias<HoldBase, Name>,
  FormName<HoldBase, Name>
>

export type FormName<HoldBase, Name extends keyof HoldBase> = AnyColumn<
  HoldBase,
  ExtractTableAlias<HoldBase, Name>
>

export type Like<HoldBase, Name extends keyof HoldBase> = {
  bond: FormBond<HoldBase, Name>
  name: FormName<HoldBase, Name>
  test: '=' | '>=' | '>' | '<' | '<=' | '!='
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

export type LoadLinkList<Base, Name extends BaseName<Base>> = {
  line: string
  linkMesh: LinkMesh
  name: Name
}

export type LoadReadLikeList<
  Base extends BaseHold,
  Name extends BaseName<Base>,
> = {
  base: Base
  find?: LoadFind
  linkMesh: LinkMesh
  name: Name
  seek: (name: unknown) => name is FormName<Base, Name>
}

export type LoadReadNameList<HoldBase, Name extends keyof HoldBase> = {
  base: Base
  name: Name
  read: LoadRead
  seek: (name: unknown) => name is FormName<HoldBase, Name>
}

export type MakeLinkList<Base, Name extends keyof Base> = {
  name: Name
  save: LoadSave
}

export type MakeMakeSeed<Name> = {
  name: Name
  save: LoadSave
}

export type MakeRead<HoldBase, Name extends keyof HoldBase> = {
  base: HoldBase
  find: LoadFind
  linkMesh: LinkMesh
  name: Name
  read: LoadRead
  seek: (name: unknown) => name is FormName<HoldBase, Name>
}

export type OmitIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? never
    : KeyType]: ObjectType[KeyType]
}

export type ReadList<HoldBase, Name extends keyof HoldBase> = {
  curb?: number
  find: LoadFind
  move?: number
  name: Name
  read: LoadRead
  seek: (name: unknown) => name is FormName<HoldBase, Name>
  sort?: Array<LoadSort>
}

export type ReadMesh<HoldBase, Name extends keyof HoldBase> = {
  find: LoadFind
  name: Name
  read: LoadRead
  seek: (name: unknown) => name is FormName<HoldBase, Name>
}

export type Sort<HoldBase, Name extends keyof HoldBase> = {
  name: SortName<HoldBase, Name>
  tilt: OrderByDirectionExpression
}

export type SortName<
  HoldBase,
  Name extends keyof HoldBase,
> = OrderByExpression<
  HoldBase,
  ExtractTableAlias<HoldBase, Name>,
  Selection<
    HoldBase,
    ExtractTableAlias<HoldBase, Name>,
    FormName<HoldBase, Name>
  >
>

export function make_read<Name extends keyof Base>({
  name,
  find,
  seek,
  base,
}: MakeRead<Name>) {
  const linkMesh: Record<string, Link> = {}
  const like_list = load_read_like_list({
    base,
    find,
    linkMesh,
    name,
    seek,
  })
}
