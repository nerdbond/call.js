import _ from 'lodash'

export default async function make(take) {
  const text: Array<string> = []
  const formName = _.snakeCase()
  text.push(
    `export const ${formName}CallTake: z.ZodType<${formName}CallCast> = z.object({`,
  )

  text.push(`})`)
}
