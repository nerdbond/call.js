import { ExtendQueryType } from '../form'
import { ZodType } from 'zod'

export function transformTableToTree(
  input: Record<string, any>,
  output: Record<string, any> = {},
) {
  for (const inputField in input) {
    const inputPath = inputField.split('__')
    let node = output
    for (let i = 0; i < inputPath.length - 1; i++) {
      const inputPart = inputPath[i]
      node = node[inputPart] ??= {}
    }
    node[inputPath[inputPath.length - 1]] = input[inputField]
  }

  return output
}

export type NestedQueryMap = Record<string, NestedQueryFunction>

export type NestedQueryFunction = (
  id: string,
  extend: ExtendQueryType,
  extendSchema?: ZodType<any>,
) => any
