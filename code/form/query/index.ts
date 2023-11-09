import { CreateQueryPayloadType } from './create'
import { RemoveQueryPayloadType } from './remove'
import { SelectQueryPayloadType } from './select'
import { UpdateQueryPayloadType } from './update'
import * as Filter from './filter'

export type QueryPayloadType =
  | CreateQueryPayloadType
  | SelectQueryPayloadType
  | UpdateQueryPayloadType
  | RemoveQueryPayloadType

export type QueryPayloadMapType = Record<string, () => QueryPayloadType>

export * from './create'
export * from './extend'
export * from './filter'
export * from './remove'
export * from './schema'
export * from './select'
export * from './update'

export { Filter }
