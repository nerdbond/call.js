import _ from 'lodash'

export default async function make(take) {
  const text: Array<string> = []
  const formName = _.snakeCase()
  text.push(`export type ${formName}CallCast = {`)

  text.push(`}`)
}
