import { BaseType } from '~/code/form/base'
import handleType from './type'
import handleParser from './parser'
import { QueryPayloadMapType } from '~/code/form/query'

export default async function handle({
  base,
  query,
}: {
  base: BaseType
  query: QueryPayloadMapType
}) {
  const type = await handleType({ base, query })
  const parser = await handleParser({ base, query })

  return { type, parser }
}
