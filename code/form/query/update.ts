import { ExtendQueryType } from './extend'
import { SchemaQueryMapType } from './schema'

export type UpdateQueryBuilderType = () => UpdateQueryType

export type UpdateQueryType = {
  filter?: SchemaQueryMapType
  effect?: SchemaQueryMapType
  extend?: ExtendQueryType
}

export type UpdateQueryPayloadType = {
  action: 'update'
  object: string
} & UpdateQueryType
