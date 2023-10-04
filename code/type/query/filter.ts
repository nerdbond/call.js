import _ from 'lodash'
import { z } from 'zod'

type Z2 = z.ZodType<FilterTestQueryType>
type Z3 = z.ZodType<FilterQueryType<FilterTestQueryType>>
type Z1 = z.ZodType<
  FilterQueryType<FilterTestQueryType> | FilterTestQueryType
>

export type FilterQueryType<T extends FilterTestQueryType> =
  | FilterAndQueryType<T>
  | FilterAndBasicQueryType<T>
  | FilterOrQueryType<T>
  | FilterOrBasicQueryType<T>
// | FilterNotQueryType<T>

export type FilterNotQueryType<T extends FilterTestQueryType> = {
  type: 'not'
  condition:
    | FilterAndQueryType<T>
    | FilterAndBasicQueryType<T>
    | FilterOrQueryType<T>
    | FilterOrBasicQueryType<T>
    | T
}

export type FilterAndQueryType<T extends FilterTestQueryType> = {
  type: 'and'
  condition: Array<FilterOrBasicQueryType<T> | T>
}

export type FilterOrQueryType<T extends FilterTestQueryType> = {
  type: 'or'
  condition: Array<FilterAndBasicQueryType<T> | T>
}

export type FilterAndBasicQueryType<T extends FilterTestQueryType> = {
  type: 'and'
  condition: Array<T>
}

export type FilterOrBasicQueryType<T extends FilterTestQueryType> = {
  type: 'or'
  condition: Array<T>
}

export type FilterTestQueryType =
  | FilterStringType
  | FilterNumberType
  | FilterDateType
  | FilterBooleanType

export type FilterTestBaseQueryType = {
  type: 'test'
  path: Array<string>
}

// string

export type FilterStringType = FilterTestBaseQueryType &
  FilterStringValueQueryType

export type FilterStringValueQueryType =
  | FilterStringBasicQueryType
  | FilterStringBasicEqualityQueryType
  | FilterStringBasicArrayQueryType

export type FilterStringBasicQueryType = {
  value: string
  test: 'start' | 'end' | 'match'
}

export type FilterStringBasicEqualityQueryType = {
  value: string | null
  test: '=' | '!='
}

export type FilterStringBasicArrayQueryType = {
  value: Array<string | null>
  test: 'in'
}

// number

export type FilterNumberType = FilterTestBaseQueryType &
  FilterNumberValueQueryType

export type FilterNumberValueQueryType =
  | FilterNumberBasicQueryType
  | FilterNumberBasicEqualityQueryType
  | FilterNumberBasicArrayQueryType

export type FilterNumberBasicQueryType = {
  value: number
  test: '>=' | '>' | '<=' | '<'
}

export type FilterNumberBasicEqualityQueryType = {
  value: number | null
  test: '=' | '!='
}

export type FilterNumberBasicArrayQueryType = {
  value: Array<number | null>
  test: 'in'
}

// date

export type FilterDateType = FilterTestBaseQueryType &
  FilterDateValueQueryType

export type FilterDateValueQueryType =
  | FilterDateBasicQueryType
  | FilterDateBasicEqualityQueryType
  | FilterDateBasicArrayQueryType

export type FilterDateBasicQueryType = {
  value: Date
  test: '>=' | '>' | '<=' | '<'
}

export type FilterDateBasicEqualityQueryType = {
  value: Date | null
  test: '=' | '!='
}

export type FilterDateBasicArrayQueryType = {
  value: Array<Date | null>
  test: 'in'
}

// boolean

export type FilterBooleanType = FilterBooleanValueQueryType

export type FilterBooleanValueQueryType =
  | FilterBooleanBasicQueryType
  | FilterBooleanBasicArrayQueryType

export type FilterBooleanBasicQueryType = FilterTestBaseQueryType & {
  value: boolean | null
  test: '=' | '!='
}

export type FilterBooleanBasicArrayQueryType =
  FilterTestBaseQueryType & {
    value: Array<boolean | null>
    test: 'in'
  }

export const FilterQuery = (
  list:
    | z.ZodTypeAny
    | readonly [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]],
) => {
  const array = 'length' in list ? list.concat(list) : [list, list]
  const child: readonly [
    z.ZodTypeAny,
    z.ZodTypeAny,
    ...z.ZodTypeAny[],
  ] = [
    FilterAndQuery(list),
    FilterAndBasicQuery(list),
    FilterOrQuery(list),
    FilterOrBasicQuery(list),
    // FilterNotQuery(list),
    // z.union(array),
  ]

  // if (isLarge(array)) {
  //   child.push()
  // } else {
  //   child.push(...array)
  // }

  return z.union(child)
}

export const FilterQuery2 = (
  list: z.ZodUnion<
    readonly [
      z.ZodType<FilterTestQueryType>,
      ...z.ZodType<FilterTestQueryType>[],
    ]
  >,
) => {
  // const child: readonly [
  //   z.ZodTypeAny,
  //   z.ZodTypeAny,
  //   ...z.ZodTypeAny[],
  // ] = [
  //   FilterAndQuery(list),
  //   FilterAndBasicQuery(list),
  //   FilterOrQuery(list),
  //   FilterOrBasicQuery(list),
  //   FilterNotQuery(list),
  //   list,
  //   // z.union(array),
  // ]

  return list

  // if (isLarge(array)) {
  //   child.push()
  // } else {
  //   child.push(...array)
  // }

  // return z.union(child)
}

export const FilterString = (path: Array<string>) =>
  z.union([
    FilterStringBasicQuery(path),
    FilterStringBasicEqualityQuery(path),
    FilterStringBasicArrayQuery(path),
  ])

export const FilterNumber = (path: Array<string>) =>
  z.union([
    FilterNumberBasicQuery(path),
    FilterNumberBasicEqualityQuery(path),
    FilterNumberBasicArrayQuery(path),
  ])

export const FilterDate = (path: Array<string>) =>
  z.union([
    FilterDateBasicQuery(path),
    FilterDateBasicEqualityQuery(path),
    FilterDateBasicArrayQuery(path),
  ])

export const FilterBoolean = (path: Array<string>) =>
  z.union([
    FilterBooleanBasicQuery(path),
    FilterBooleanBasicArrayQuery(path),
  ])

// not

function isLarge(
  list: readonly [Z2, Z2, ...Z2[]] | Z2[],
): list is [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]] {
  return list.length > 1
}

export const FilterNotQuery = (
  list: Z2 | readonly [Z2, Z2, ...Z2[]],
) => {
  // | Array<FilterAndQueryType<T> | FilterOrQueryType<T> | T>
  // | FilterAndQueryType<T>
  // | FilterOrQueryType<T>
  // | T
  const and = FilterAndQuery(list)
  const or = FilterOrQuery(list)
  const array = 'length' in list ? list : [list]
  const single = isLarge(array)
    ? z.union([and, or, z.union(array)])
    : z.union([and, or, array[0]])
  const condition = isLarge(array)
    ? z.union([z.array(single), single])
    : z.union([z.array(single), and, array[0]])

  console.log(array)

  return z.object({
    type: z.enum(['not']),
    condition: z.union([and, z.string()]),
  })
}

// and

export const FilterAndQuery = (list: Z2 | readonly [Z2, Z2, ...Z2[]]) =>
  z.object({
    type: z.enum(['and']),
    condition:
      'length' in list
        ? z.array(z.union([FilterAndBasicQuery(list), ...list]))
        : z.array(z.union([FilterAndBasicQuery(list), list])),
  })

export const FilterAndBasicQuery = (
  list: Z2 | readonly [Z2, Z2, ...Z2[]],
) =>
  z.object({
    type: z.enum(['and']),
    condition:
      'length' in list
        ? list.length === 1
          ? z.array(list[0])
          : z.array(z.union(list))
        : z.array(list),
  })

// or

export const FilterOrQuery = (list: Z2 | readonly [Z2, Z2, ...Z2[]]) =>
  z.object({
    type: z.enum(['or']),
    condition:
      'length' in list
        ? z.array(z.union([FilterAndBasicQuery(list), ...list]))
        : z.array(z.union([FilterAndBasicQuery(list), list])),
  })

export const FilterOrBasicQuery = (
  list: Z2 | readonly [Z2, Z2, ...Z2[]],
) =>
  z.object({
    type: z.enum(['or']),
    condition:
      'length' in list
        ? list.length === 1
          ? z.array(list[0])
          : z.array(z.union(list))
        : z.array(list),
  })

// base

export const FilterTestBaseQuery = (
  // path: [z.ZodLiteral<string>, ...z.ZodLiteral<string>[]],
  path: Array<string>,
) => {
  return z.object({
    type: z.enum(['test']),
    path: z
      .array(z.string())
      .refine(
        array => array.length === path.length && _.isEqual(path, array),
        {
          message: `Path is invalid`,
        },
      ),
  })
}

// string

export const FilterStringBasicQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.string(),
      test: z.enum(['start', 'end', 'match']),
    }),
  )

export const FilterStringBasicEqualityQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.union([z.string(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FilterStringBasicArrayQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.array(z.union([z.string(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// number

export const FilterNumberBasicQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.number(),
      test: z.enum(['>=', '>', '<=', '<']),
    }),
  )

export const FilterNumberBasicEqualityQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.union([z.number(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FilterNumberBasicArrayQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.array(z.union([z.number(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// date

export const FilterDateBasicQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.coerce.date(),
      test: z.enum(['>=', '>', '<=', '<']),
    }),
  )

export const FilterDateBasicEqualityQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.union([z.coerce.date(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FilterDateBasicArrayQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.array(z.union([z.coerce.date(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// boolean

export const FilterBooleanBasicQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.union([z.boolean(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FilterBooleanBasicArrayQuery = (path: Array<string>) =>
  z.intersection(
    FilterTestBaseQuery(path),
    z.object({
      value: z.array(z.union([z.boolean(), z.null()])),
      test: z.enum(['in']),
    }),
  )

type AType = {
  filter: FilterQueryType<FilterBooleanType>
}

const b = FilterBoolean(['foo', 'bar'])
const q = FilterQuery2(b)
const A: z.ZodType<AType> = z.object({
  filter: b,
})

console.log(A)
