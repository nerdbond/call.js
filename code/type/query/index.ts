import { CreateQueryPayloadType } from './create'
import { GatherQueryPayloadType } from './gather'
import { RemoveQueryPayloadType } from './remove'
import { SelectQueryPayloadType } from './select'
import { UpdateQueryPayloadType } from './update'

export type QueryPayloadType =
  | CreateQueryPayloadType
  | SelectQueryPayloadType
  | GatherQueryPayloadType
  | UpdateQueryPayloadType
  | RemoveQueryPayloadType

export type QueryPayloadMapType = Record<string, () => QueryPayloadType>
