import _ from 'lodash'
import { toPascalCase } from '~/code/tool'

export default async function make(take) {
  const text: Array<string> = []
  const formName = toPascalCase
  text.push(
    `export const ${formName}Take: z.ZodType<${formName}Cast> = z.object({`,
  )

  text.push(`})`)
}
