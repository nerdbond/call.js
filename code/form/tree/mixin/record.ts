import { z } from 'zod'

export function record(form: () => z.ZodType<any>) {
  return z.optional(z.lazy(form))
}
