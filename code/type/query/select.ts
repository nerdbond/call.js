import { ExtendQueryType } from './extend'
import { SchemaQueryMapType } from './schema'

export type SelectQueryPayloadType = {
  action: 'select'
  object: string
} & SelectQueryType

export type SelectQueryType = {
  filter?: SchemaQueryMapType
  extend: ExtendQueryType
}
