export function transformHaveToHoldForm(
  effect: Record<string, any>,
  definition: Record<string, string>,
  path: Array<string> = [],
  output: Record<string, any> = {},
) {
  for (const name in effect) {
    const value = effect[name]

    if (value && typeof value === 'object') {
      transformHaveToHoldForm(
        value as Record<string, any>,
        definition,
        path.concat([name]),
        output,
      )
    } else {
      const key = path.concat([name]).join('$')
      const field = definition[key]

      if (field) {
        output[field] = value
      }
    }
  }

  return output
}
