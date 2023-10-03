import { ExtendQueryType } from './extend'
import { SchemaQueryMapType } from './schema'

export type RemoveQueryBuilderType = () => RemoveQueryType

export type RemoveQueryType = {
  filter?: SchemaQueryMapType
  extend?: ExtendQueryType
}

export type RemoveQueryPayloadType = {
  action: 'remove'
  object: string
} & RemoveQueryType
