export function transformHaveToHoldForm(
  have: Record<string, any>,
  definition: Record<string, string>,
  line: Array<string> = [],
  head: Record<string, any> = {},
) {
  for (const name in have) {
    const value = have[name]

    if (value && typeof value === 'object') {
      transformHaveToHoldForm(
        value as Record<string, any>,
        definition,
        line.concat([name]),
        head,
      )
    } else {
      const key = line.concat([name]).join('$')
      const field = definition[key]

      if (field) {
        head[field] = value
      }
    }
  }

  return head
}
