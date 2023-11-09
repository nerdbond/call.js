import { z } from 'zod'

export type Paginated<T> = {
  total?: number
  record?: Array<T>
}

export function paginated(schema: () => z.ZodType<any>) {
  return z.optional(
    z.object({
      total: z.optional(z.number().int()),
      record: z.optional(z.array(z.lazy(schema))),
    }),
  )
}
