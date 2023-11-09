import { z } from 'zod'

export function site(form: () => z.ZodType<any>) {
  return z.optional(z.lazy(form))
}
