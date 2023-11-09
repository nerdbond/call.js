import { z } from 'zod'

export type List<T> = {
  size?: number
  load?: Array<T>
}

export function list(schema: () => z.ZodType<any>) {
  return z.optional(
    z.object({
      size: z.optional(z.number().int()),
      load: z.optional(z.array(z.lazy(schema))),
    }),
  )
}
