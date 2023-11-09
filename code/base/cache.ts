import _ from 'lodash'

export type CacheType = Record<
  string,
  Record<string, Record<string, any>>
>

export function insert({
  cache,
  type,
  record,
  id,
}: {
  cache: CacheType
  record: Record<string, any>
  id: string
  type: string
}) {
  const map = (cache[type] ??= {})
  const source = (map[id] ??= {})
  _.merge(source, record)
}
