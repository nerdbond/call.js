import _ from 'lodash'
import { z } from 'zod'

type AS = Array<string>

export type FilterQueryType<
  T extends FilterTestQueryType = FilterTestQueryType,
> =
  | FilterAndQueryType<T>
  | FilterOrQueryType<T>
  | FilterNotQueryType<T>
  | T

export type FilterNotQueryType<T extends FilterTestQueryType> = {
  type: 'not'
  condition:
    | Array<FilterAndQueryType<T> | FilterOrQueryType<T> | T>
    | FilterAndQueryType<T>
    | FilterOrQueryType<T>
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

export type FilterTestQueryType<P extends AS = Array<string>> =
  | FilterStringQueryType<P>
  | FilterNumberQueryType<P>
  | FilterDateQueryType<P>
  | FilterBooleanQueryType<P>

export type FilterTestBaseQueryType<P extends AS> = {
  type: 'test'
  path: P
}

// string

export type FilterStringQueryType<P extends AS> =
  FilterTestBaseQueryType<P> & FilterStringValueQueryType

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

export type FilterNumberQueryType<P extends AS> =
  FilterTestBaseQueryType<P> & FilterNumberValueQueryType

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

export type FilterDateQueryType<P extends AS> =
  FilterTestBaseQueryType<P> & FilterDateValueQueryType

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

export type FilterBooleanQueryType<P extends AS> =
  FilterTestBaseQueryType<P> & FilterBooleanValueQueryType

export type FilterBooleanValueQueryType =
  | FilterBooleanBasicQueryType
  | FilterBooleanBasicArrayQueryType

export type FilterBooleanBasicQueryType = {
  value: boolean | null
  test: '=' | '!='
}

export type FilterBooleanBasicArrayQueryType = {
  value: Array<boolean | null>
  test: 'in'
}

export const FilterQuery = (
  type: 'string' | 'number' | 'date' | 'boolean',
  path: Array<string>,
) => {
  let Basic

  switch (type) {
    case 'string':
      Basic = FilterStringQuery(path)
      break
    case 'number':
      Basic = FilterNumberQuery(path)
      break
    case 'date':
      Basic = FilterDateQuery(path)
      break
    case 'boolean':
      Basic = FilterBooleanQuery(path)
      break
  }

  return z.union([
    FilterNotQuery(Basic),
    FilterAndQuery(Basic),
    FilterAndBasicQuery(Basic),
    FilterOrQuery(Basic),
    FilterOrBasicQuery(Basic),
    Basic,
  ])
}

export const FilterStringQuery = (path: Array<string>) =>
  z.union([
    FilterStringBasicQuery(path),
    FilterStringBasicEqualityQuery(path),
    FilterStringBasicArrayQuery(path),
  ])

export const FilterNumberQuery = (path: Array<string>) =>
  z.union([
    FilterNumberBasicQuery(path),
    FilterNumberBasicEqualityQuery(path),
    FilterNumberBasicArrayQuery(path),
  ])

export const FilterDateQuery = (path: Array<string>) =>
  z.union([
    FilterDateBasicQuery(path),
    FilterDateBasicEqualityQuery(path),
    FilterDateBasicArrayQuery(path),
  ])

export const FilterBooleanQuery = (path: Array<string>) =>
  z.union([
    FilterBooleanBasicQuery(path),
    FilterBooleanBasicArrayQuery(path),
  ])

// not

export const FilterNotQuery = (base: z.ZodType<any>) => {
  const and = FilterAndQuery(base)
  const or = FilterOrQuery(base)
  const single = z.union([and, or, base])

  return z.object({
    type: z.enum(['not']),
    condition: z.union([z.array(single), and, or, base]),
  })
}

// and

export const FilterAndQuery = (base: z.ZodType<any>) =>
  z.object({
    type: z.enum(['and']),
    condition: z.array(z.union([FilterOrBasicQuery(base), base])),
  })

export const FilterAndBasicQuery = (base: z.ZodType<any>) =>
  z.object({
    type: z.enum(['and']),
    condition: z.array(base),
  })

// or

export const FilterOrQuery = (base: z.ZodType<any>) =>
  z.object({
    type: z.enum(['or']),
    condition: z.array(z.union([FilterAndBasicQuery(base), base])),
  })

export const FilterOrBasicQuery = (base: z.ZodType<any>) =>
  z.object({
    type: z.enum(['or']),
    condition: z.array(base),
  })

// base

export const FilterTestBaseQuery = (path: Array<string>) =>
  z.object({
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

// string

export const FilterStringBasicQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.string(),
      test: z.enum(['start', 'end', 'match']),
    }),
  )

export const FilterStringBasicEqualityQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.union([z.string(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FilterStringBasicArrayQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.array(z.union([z.string(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// number

export const FilterNumberBasicQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.number(),
      test: z.enum(['>=', '>', '<=', '<']),
    }),
  )

export const FilterNumberBasicEqualityQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.union([z.number(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FilterNumberBasicArrayQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.array(z.union([z.number(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// date

export const FilterDateBasicQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.coerce.date(),
      test: z.enum(['>=', '>', '<=', '<']),
    }),
  )

export const FilterDateBasicEqualityQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.union([z.coerce.date(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FilterDateBasicArrayQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.array(z.union([z.coerce.date(), z.null()])),
      test: z.enum(['in']),
    }),
  )

// boolean

export const FilterBooleanBasicQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.union([z.boolean(), z.null()]),
      test: z.enum(['=', '!=']),
    }),
  )

export const FilterBooleanBasicArrayQuery = (path: Array<string>) =>
  FilterTestBaseQuery(path).merge(
    z.object({
      value: z.array(z.union([z.boolean(), z.null()])),
      test: z.enum(['in']),
    }),
  )
