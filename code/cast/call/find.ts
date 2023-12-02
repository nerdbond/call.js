import _ from 'lodash'
import { z } from 'zod'

export type FindCallCast<
  T extends FindTestCallCast = FindTestCallCast,
> =
  | FindAndCallCast<T>
  | FindAndBasicCallCast<T>
  | FindOrCallCast<T>
  | FindOrBasicCallCast<T>
  | FindNotCallCast<T>

export type FindNotCallCast<T extends FindTestCallCast> = {
  form: 'not'
  test:
    | FindAndCallCast<T>
    | FindAndBasicCallCast<T>
    | FindOrCallCast<T>
    | FindOrBasicCallCast<T>
    | T
}

export type FindAndCallCast<T extends FindTestCallCast> = {
  form: 'and'
  test: Array<FindOrBasicCallCast<T> | T>
}

export type FindOrCallCast<T extends FindTestCallCast> = {
  form: 'or'
  test: Array<FindAndBasicCallCast<T> | T>
}

export type FindAndBasicCallCast<T extends FindTestCallCast> = {
  form: 'and'
  test: Array<T>
}

export type FindOrBasicCallCast<T extends FindTestCallCast> = {
  form: 'or'
  test: Array<T>
}

export type FindTestCallCast =
  | FindStringType
  | FindNumberType
  | FindDateType
  | FindBooleanType

export type FindTestBaseCallCast = {
  form: 'test'
  link: Array<string>
}

// string

export type FindStringType = FindTestBaseCallCast &
  FindStringValueCallCast

export type FindStringValueCallCast =
  | FindStringBasicCallCast
  | FindStringBasicEqualityCallCast
  | FindStringBasicArrayCallCast

export type FindStringBasicCallCast = {
  bond: string
  test: 'start' | 'end' | 'match'
}

export type FindStringBasicEqualityCallCast = {
  bond: string | null
  test: '=' | '!='
}

export type FindStringBasicArrayCallCast = {
  bond: Array<string | null>
  test: 'in'
}

// number

export type FindNumberType = FindTestBaseCallCast &
  FindNumberValueCallCast

export type FindNumberValueCallCast =
  | FindNumberBasicCallCast
  | FindNumberBasicEqualityCallCast
  | FindNumberBasicArrayCallCast

export type FindNumberBasicCallCast = {
  bond: number
  test: '>=' | '>' | '<=' | '<'
}

export type FindNumberBasicEqualityCallCast = {
  bond: number | null
  test: '=' | '!='
}

export type FindNumberBasicArrayCallCast = {
  bond: Array<number | null>
  test: 'in'
}

// date

export type FindDateType = FindTestBaseCallCast & FindDateValueCallCast

export type FindDateValueCallCast =
  | FindDateBasicCallCast
  | FindDateBasicEqualityCallCast
  | FindDateBasicArrayCallCast

export type FindDateBasicCallCast = {
  bond: Date
  test: '>=' | '>' | '<=' | '<'
}

export type FindDateBasicEqualityCallCast = {
  bond: Date | null
  test: '=' | '!='
}

export type FindDateBasicArrayCallCast = {
  bond: Array<Date | null>
  test: 'in'
}

// boolean

export type FindBooleanType = FindBooleanValueCallCast

export type FindBooleanValueCallCast =
  | FindBooleanBasicCallCast
  | FindBooleanBasicArrayCallCast

export type FindBooleanBasicCallCast = FindTestBaseCallCast & {
  bond: boolean | null
  test: '=' | '!='
}

export type FindBooleanBasicArrayCallCast = FindTestBaseCallCast & {
  bond: Array<boolean | null>
  test: 'in'
}

export const FindCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) => {
  const array = 'length' in list ? list.concat(list) : [list, list]
  const child: [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>] = [
    FindAndCall(list),
    FindAndBasicCall(list),
    FindOrCall(list),
    FindOrBasicCall(list),
    FindNotCall(list),
  ]

  if (isLarge(array)) {
    child.push(...array)
  } else {
    child.push(array[0])
  }

  return z.union(child)
}

export const FindString = (link: Array<string>) =>
  z.union([
    FindStringBasicCall(link),
    FindStringBasicEqualityCall(link),
    FindStringBasicArrayCall(link),
  ])

export const FindNumber = (link: Array<string>) =>
  z.union([
    FindNumberBasicCall(link),
    FindNumberBasicEqualityCall(link),
    FindNumberBasicArrayCall(link),
  ])

export const FindDate = (link: Array<string>) =>
  z.union([
    FindDateBasicCall(link),
    FindDateBasicEqualityCall(link),
    FindDateBasicArrayCall(link),
  ])

export const FindBoolean = (link: Array<string>) =>
  z.union([FindBooleanBasicCall(link), FindBooleanBasicArrayCall(link)])

// not

function isLarge(
  list:
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>]
    | Array<z.ZodTypeAny>,
): list is [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>] {
  return list.length > 1
}

export const FindNotCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) => {
  const and = FindAndCall(list)
  const or = FindOrCall(list)
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

export const FindAndCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) =>
  z.object({
    form: z.enum(['and']),
    test:
      'length' in list
        ? z.array(z.union([FindAndBasicCall(list), ...list]))
        : z.array(z.union([FindAndBasicCall(list), list])),
  })

export const FindAndBasicCall = (
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

export const FindOrCall = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...Array<z.ZodTypeAny>],
) =>
  z.object({
    form: z.enum(['or']),
    test:
      'length' in list
        ? z.array(z.union([FindAndBasicCall(list), ...list]))
        : z.array(z.union([FindAndBasicCall(list), list])),
  })

export const FindOrBasicCall = (
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

export const FindTestBaseCall = (link: Array<string>) => {
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

export const FindStringBasicCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.string(),
      test: z.enum(['start', 'end', 'match']),
    }),
  )

export const FindStringBasicEqualityCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.union([z.string(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FindStringBasicArrayCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.array(z.union([z.string(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// number

export const FindNumberBasicCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.number(),
      test: z.enum(['>=', '>', '<=', '<']),
    }),
  )

export const FindNumberBasicEqualityCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.union([z.number(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FindNumberBasicArrayCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.array(z.union([z.number(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// date

export const FindDateBasicCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.coerce.date(),
      test: z.enum(['>=', '>', '<=', '<']),
    }),
  )

export const FindDateBasicEqualityCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.union([z.coerce.date(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FindDateBasicArrayCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.array(z.union([z.coerce.date(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// boolean

export const FindBooleanBasicCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.union([z.boolean(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FindBooleanBasicArrayCall = (link: Array<string>) =>
  z.intersection(
    FindTestBaseCall(link),
    z.object({
      bond: z.array(z.union([z.boolean(), z.null()])),
      test: z.enum(['in']),
    }),
  )
