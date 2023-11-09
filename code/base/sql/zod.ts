import { z } from 'zod'

export function getProperty(schema: any, name: string) {
  if (
    'shape' in schema &&
    schema.shape &&
    typeof schema.shape === 'object' &&
    name in schema.shape
  ) {
    return (schema.shape as Record<string, any>)[name] as z.ZodType<any>
  }
}
