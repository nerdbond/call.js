import _ from 'lodash'
import { z } from 'zod'

export type SeekCallCast<
  T extends SeekTestCallCast = SeekTestCallCast,
> =
  | SeekAndCallCast<T>
  | SeekAndBasicCallCast<T>
  | SeekOrCallCast<T>
  | SeekOrBasicCallCast<T>
  | SeekNotCallCast<T>

export type SeekNotCallCast<T extends SeekTestCallCast> = {
  form: 'not'
  test:
    | SeekAndCallCast<T>
    | SeekAndBasicCallCast<T>
    | SeekOrCallCast<T>
    | SeekOrBasicCallCast<T>
    | T
}

export type SeekAndCallCast<T extends SeekTestCallCast> = {
  form: 'and'
  test: Array<SeekOrBasicCallCast<T> | T>
}

export type SeekOrCallCast<T extends SeekTestCallCast> = {
  form: 'or'
  test: Array<SeekAndBasicCallCast<T> | T>
}

export type SeekAndBasicCallCast<T extends SeekTestCallCast> = {
  form: 'and'
  test: Array<T>
}

export type SeekOrBasicCallCast<T extends SeekTestCallCast> = {
  form: 'or'
  test: Array<T>
}

export type SeekTestCallCast =
  | SeekStringType
  | SeekNumberType
  | SeekDateType
  | SeekBooleanType

export type SeekTestBaseCallCast = {
  form: 'test'
  link: Array<string>
}

// string

export type SeekStringType = SeekTestBaseCallCast &
  SeekStringValueCallCast

export type SeekStringValueCallCast =
  | SeekStringBasicCallCast
  | SeekStringBasicEqualityCallCast
  | SeekStringBasicArrayCallCast

export type SeekStringBasicCallCast = {
  bond: string
  test: 'start' | 'end' | 'match'
}

export type SeekStringBasicEqualityCallCast = {
  bond: string | null
  test: '=' | '!='
}

export type SeekStringBasicArrayCallCast = {
  bond: Array<string | null>
  test: 'in'
}

// number

export type SeekNumberType = SeekTestBaseCallCast &
  SeekNumberValueCallCast

export type SeekNumberValueCallCast =
  | SeekNumberBasicCallCast
  | SeekNumberBasicEqualityCallCast
  | SeekNumberBasicArrayCallCast

export type SeekNumberBasicCallCast = {
  bond: number
  test: '>=' | '>' | '<=' | '<'
}

export type SeekNumberBasicEqualityCallCast = {
  bond: number | null
  test: '=' | '!='
}

export type SeekNumberBasicArrayCallCast = {
  bond: Array<number | null>
  test: 'in'
}

// date

export type SeekDateType = SeekTestBaseCallCast & SeekDateValueCallCast

export type SeekDateValueCallCast =
  | SeekDateBasicCallCast
  | SeekDateBasicEqualityCallCast
  | SeekDateBasicArrayCallCast

export type SeekDateBasicCallCast = {
  bond: Date
  test: '>=' | '>' | '<=' | '<'
}

export type SeekDateBasicEqualityCallCast = {
  bond: Date | null
  test: '=' | '!='
}

export type SeekDateBasicArrayCallCast = {
  bond: Array<Date | null>
  test: 'in'
}

// boolean

export type SeekBooleanType = SeekBooleanValueCallCast

export type SeekBooleanValueCallCast =
  | SeekBooleanBasicCallCast
  | SeekBooleanBasicArrayCallCast

export type SeekBooleanBasicCallCast = SeekTestBaseCallCast & {
  bond: boolean | null
  test: '=' | '!='
}

export type SeekBooleanBasicArrayCallCast = SeekTestBaseCallCast & {
  bond: Array<boolean | null>
  test: 'in'
}

export const SeekCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) => {
  const array = 'length' in list ? list.concat(list) : [list, list]
  const child: [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>] = [
    SeekAndCall(list),
    SeekAndBasicCall(list),
    SeekOrCall(list),
    SeekOrBasicCall(list),
    SeekNotCall(list),
  ]

  if (isLarge(array)) {
    child.push(...array)
  } else {
    child.push(array[0])
  }

  return z.union(child)
}

export const SeekString = (link: Array<string>) =>
  z.union([
    SeekStringBasicCall(link),
    SeekStringBasicEqualityCall(link),
    SeekStringBasicArrayCall(link),
  ])

export const SeekNumber = (link: Array<string>) =>
  z.union([
    SeekNumberBasicCall(link),
    SeekNumberBasicEqualityCall(link),
    SeekNumberBasicArrayCall(link),
  ])

export const SeekDate = (link: Array<string>) =>
  z.union([
    SeekDateBasicCall(link),
    SeekDateBasicEqualityCall(link),
    SeekDateBasicArrayCall(link),
  ])

export const SeekBoolean = (link: Array<string>) =>
  z.union([SeekBooleanBasicCall(link), SeekBooleanBasicArrayCall(link)])

// not

function isLarge(
  list:
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>]
    | Array<z.ZodTypeAny>,
): list is [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>] {
  return list.length > 1
}

export const SeekNotCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) => {
  const and = SeekAndCall(list)
  const or = SeekOrCall(list)
  const array = 'length' in list ? list : [list]
  const single = isLarge(array)
    ? z.union([and, or, z.union(array)])
    : z.union([and, or, array[0]])
  const test = isLarge(array)
    ? z.union([z.array(single), single])
    : z.union([z.array(single), and, array[0]])

  return z.object({
    form: z.enum(['not']),
    test,
  })
}

// and

export const SeekAndCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) =>
  z.object({
    form: z.enum(['and']),
    test:
      'length' in list
        ? z.array(z.union([SeekAndBasicCall(list), ...list]))
        : z.array(z.union([SeekAndBasicCall(list), list])),
  })

export const SeekAndBasicCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) =>
  z.object({
    form: z.enum(['and']),
    test:
      'length' in list
        ? list.length === 1
          ? z.array(list[0])
          : z.array(z.union(list))
        : z.array(list),
  })

// or

export const SeekOrCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) =>
  z.object({
    form: z.enum(['or']),
    test:
      'length' in list
        ? z.array(z.union([SeekAndBasicCall(list), ...list]))
        : z.array(z.union([SeekAndBasicCall(list), list])),
  })

export const SeekOrBasicCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) =>
  z.object({
    form: z.enum(['or']),
    test:
      'length' in list
        ? list.length === 1
          ? z.array(list[0])
          : z.array(z.union(list))
        : z.array(list),
  })

// base

export const SeekTestBaseCall = (link: Array<string>) => {
  return z.object({
    form: z.enum(['test']),
    link: z
      .array(z.string())
      .refine(
        array => array.length === link.length && _.isEqual(link, array),
        {
          message: `Path is invalid`,
        },
      ),
  })
}

// string

export const SeekStringBasicCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.string(),
      test: z.enum(['start', 'end', 'match']),
    }),
  )

export const SeekStringBasicEqualityCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.union([z.string(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const SeekStringBasicArrayCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.array(z.union([z.string(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// number

export const SeekNumberBasicCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.number(),
      test: z.enum(['>=', '>', '<=', '<']),
    }),
  )

export const SeekNumberBasicEqualityCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.union([z.number(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const SeekNumberBasicArrayCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.array(z.union([z.number(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// date

export const SeekDateBasicCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.coerce.date(),
      test: z.enum(['>=', '>', '<=', '<']),
    }),
  )

export const SeekDateBasicEqualityCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.union([z.coerce.date(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const SeekDateBasicArrayCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.array(z.union([z.coerce.date(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// boolean

export const SeekBooleanBasicCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.union([z.boolean(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const SeekBooleanBasicArrayCall = (link: Array<string>) =>
  z.intersection(
    SeekTestBaseCall(link),
    z.object({
      bond: z.array(z.union([z.boolean(), z.null()])),
      test: z.enum(['in']),
    }),
  )
