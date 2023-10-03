import { CreateQueryPayloadType } from './create'
import { RemoveQueryPayloadType } from './remove'
import { SelectQueryPayloadType } from './select'
import { UpdateQueryPayloadType } from './update'

export type QueryPayloadType =
  | CreateQueryPayloadType
  | SelectQueryPayloadType
  | UpdateQueryPayloadType
  | RemoveQueryPayloadType

export type QueryPayloadMapType = Record<string, () => QueryPayloadType>
