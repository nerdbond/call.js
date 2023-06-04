import { ZodCustomIssue, ZodIssue, z, RefinementCtx } from 'zod'

import type { Base as FormBase } from '@tunebond/form'
import { haveMesh, haveText, testMesh } from '@tunebond/have'
import halt, { HaltBase, HaltBaseName } from 'halt'
import { Link } from '@tunebond/halt'

export type Call = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load: (link: any) => Load
  read: LoadRead
}

export type { FormBase }

export type CallBase = Record<string, Call>

export type ReadTakeBase = LoadRead

export type SaveTakeBase = LoadSave

export type Base = {
  call: CallBase
  form: FormBase
  read: ReadTakeBase
  save: SaveTakeBase
}

export const LOAD_FIND_TEST = [
  'bond',
  'base_link_mark',
  'head_link_mark',
  'base_mark',
  'head_mark',
  // 'base_text',
  // 'head_text',
  'miss_bond',
  'have_bond',
  'have_text',
] as const

export type Load = {
  find?: LoadFind
  read?: LoadRead
  save?: LoadSave
  task?: string
}

export type LoadFind = LoadFindLink

export type LoadFindBind = {
  form: 'bind'
  list: Array<LoadFindLink>
}

export type LoadFindLike = {
  base: LoadFindLikeLinkBond
  form: 'like'
  head: LoadFindLikeBond | LoadFindLikeLinkBond
  test: LoadFindTest
}

export type LoadFindLikeBond = string | boolean | null | number

export type LoadFindLikeLinkBond = {
  link: string
}

export type LoadFindLink = LoadFindLike | LoadFindRoll | LoadFindBind

export type LoadFindRoll = {
  form: 'roll'
  list: Array<LoadFindLink>
}

export type LoadFindTest = typeof LOAD_FIND_TEST[number]

export type LoadRead = {
  [key: string]: boolean | LoadReadLink
}

export type LoadReadLink = {
  find?: LoadFind
  list?: boolean
  read: LoadRead
  // sort?: LoadSort
}

export type LoadSave = {
  [key: string]: Array<LoadSaveBase> | LoadSaveBase
}

export type LoadSaveBase = {
  find?: LoadFind
  read?: LoadRead
  save?: LoadSave
  task?: string
}

export type LoadSort = {
  link: string
  tilt: LoadTilt
}

export type LoadTilt = 'rise' | 'fall'

export const Load: z.ZodType<Load> = z.object({
  find: z.optional(z.lazy(() => LoadFind)),
  read: z.optional(z.lazy(() => LoadRead)),
  save: z.optional(z.lazy(() => LoadSave)),
  task: z.optional(z.string()),
})

export const LoadFind: z.ZodType<LoadFind> = z.lazy(() => LoadFindLink)

export const LoadRead: z.ZodType<LoadRead> = z.record(
  z.union([z.lazy(() => LoadReadLink), z.literal(true)]),
)

export const LoadSave: z.ZodType<LoadSave> = z.record(
  z.lazy(() => LoadSaveBase),
  z.array(z.lazy(() => LoadSaveBase)),
)

export const LoadFindBind: z.ZodType<LoadFindBind> = z.object({
  form: z.literal('bind'),
  list: z.array(z.lazy(() => LoadFindLink)),
})

export const LoadFindRoll: z.ZodType<LoadFindRoll> = z.object({
  form: z.literal('roll'),
  list: z.lazy(() => z.array(LoadFindLink)),
})

export const LoadFindTest = z.enum([
  'bond',
  'base_link_mark',
  'head_link_mark',
  'base_mark',
  'head_mark',
  // 'base_text',
  // 'head_text',
  'miss_bond',
  'have_bond',
  'have_text',
])

export const LoadFindLike: z.ZodType<LoadFindLike> = z.object({
  base: z.lazy(() => LoadFindLikeLinkBond),
  form: z.literal('like'),
  head: z.union([
    z.lazy(() => LoadFindLikeLinkBond),
    z.lazy(() => LoadFindLikeBond),
  ]),
  test: LoadFindTest,
})

export const LoadFindLink: z.ZodType<LoadFindLink> = z.union([
  z.lazy(() => LoadFindLike),
  z.lazy(() => LoadFindRoll),
  z.lazy(() => LoadFindBind),
])

export const LoadFindLikeBond: z.ZodType<LoadFindLikeBond> = z.union([
  z.string(),
  z.boolean(),
  z.null(),
  z.number(),
])

export const LoadFindLikeLinkBond: z.ZodType<LoadFindLikeLinkBond> =
  z.object({
    link: z.string(),
  })

export const LoadReadLink: z.ZodType<LoadReadLink> = z.object({
  find: z.optional(LoadFind),
  read: LoadRead,
})

export const LoadSaveBase: z.ZodType<LoadSaveBase> = z.object({
  find: z.optional(LoadFind),
  read: z.optional(LoadRead),
  save: z.optional(LoadSave),
  task: z.optional(z.string()),
})

export const LoadSort: z.ZodType<LoadSort> = z.object({
  link: z.string(),
  tilt: z.enum(['rise', 'fall']),
})

assertZodObject(LoadReadLink)

// for (const name in LoadReadLink.shape) {
//   const def = LoadReadLink.shape[name] as z.ZodType
//   if (def instanceof z.ZodString) {
//     const min = def._def.checks.find(ch => ch.kind === 'min')
//     const max = def._def.checks.find(ch => ch.kind === 'max')
//   } else if (def instanceof z.ZodEnum) {
//     const map = def.enum
//   } else if (def instanceof z.ZodObject) {
//     console.log(def)
//   } else if (def instanceof z.ZodOptional) {
//     console.log(def.unwrap())
//   }
// }

export function assertZodObject<S extends z.ZodObject<z.ZodRawShape>>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  x: any,
): asserts x is S {
  if (!(x instanceof z.ZodObject)) {
    throw new Error()
  }
}

export function assertType<S extends z.ZodType>(
  x: unknown,
  schema: S,
): asserts x is S extends z.ZodType<infer T> ? T : never {
  schema.parse(x)
}

export function isType<S extends z.ZodType>(
  x: unknown,
  schema: S,
): x is S extends z.ZodType<infer T> ? T : never {
  return schema.safeParse(x).success
}

export type Prefixed<P extends string, T> = {
  [K in keyof T as K extends string ? `${P}${K}` : never]: T[K]
}

export type MoldBase<T> = {
  [K in keyof T]: {
    [K2 in keyof T[K]]: 'form' extends keyof T[K][K2]
      ? T[K][K2]['form'] extends keyof TextFormLink
        ? TextFormLink[T[K][K2]['form']]
        : T[K][K2]
      : T[K][K2]
  }
}

export type TextFormLink = {
  boolean: boolean
  number: number
  string: string
}

export type MakeForm<T> = {
  [K in keyof T]: {
    [K2 in keyof T[K]]: 'form' extends keyof T[K][K2]
      ? T[K][K2]['form'] extends keyof TextFormLink
        ? TextFormLink[T[K][K2]['form']]
        : T[K][K2] extends {
            form: ReadonlyArray<unknown>
            list: boolean
          }
        ? Array<
            TextFormLink[T[K][K2]['form'][number] & keyof TextFormLink]
          >
        : T[K][K2]['form']
      : T[K][K2]
  }
}

export function makeHaltFromZod(issue: ZodIssue | ZodCustomIssue) {
  switch (issue.code) {
    case 'invalid_type':
      switch (issue.message) {
        case 'Required':
          return halt('link_need', { line: issue.path }).toJSON()
        default:
          return halt('link_form', {
            line: issue.path,
            need: issue.expected,
          }).toJSON()
      }
    case 'invalid_union':
      break
    case 'invalid_enum_value':
      return halt('link_take', {
        line: issue.path,
        need: issue.options,
      }).toJSON()
    case 'custom':
      if (
        testMesh(issue.params) &&
        issue.params.halt &&
        testMesh(issue.params.bond)
      ) {
        return issue.params.bond
      } else {
      }
    default:
      throw new Error(`Unhandled ` + JSON.stringify(issue))
  }
}

export type BondHaltRest = {
  link?: Link<HaltBase, HaltBaseName>
  test: (bond: unknown, link: Record<string, unknown>) => boolean
  line?: Array<string>
}

export function bondHalt(
  form: HaltBaseName,
  lead: unknown,
  bind: RefinementCtx,
  { link = {}, test, line }: BondHaltRest,
) {
  const rise = test(lead, link)

  if (!rise) {
    const { note, ...bond } = halt(form, link).toJSON()

    bind.addIssue({
      code: z.ZodIssueCode.custom,
      message: note,
      path: line,
      params: {
        halt: true,
        bond: {
          ...bond,
          lead,
        },
      },
    })
  }

  return rise
}

export function testHave(lead: unknown) {
  return lead != null
}

type TestTakeRest = {
  take: Array<unknown>
}

export function testTake(lead: unknown, { take }: TestTakeRest) {
  return take.includes(lead)
}
