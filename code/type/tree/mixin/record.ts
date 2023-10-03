import { z } from 'zod'

export function record(schema: () => z.ZodType<any>) {
  return z.optional(z.lazy(schema))
}
