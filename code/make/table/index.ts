import { BaseType } from '~/code/type/base'
import handleType from './type'
import handleParser from './parser'

export default async function handle({ base }: { base: BaseType }) {
  const type = await handleType({ base })
  const parser = await handleParser({ base })

  return { type, parser }
}
