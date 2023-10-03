import { ExtendQueryType } from './extend'
import { SchemaQueryMapType } from './schema'

export type CreateQueryBuilderType = () => CreateQueryType

export type CreateQueryType = {
  effect?: SchemaQueryMapType
  extend?: ExtendQueryType
}

export type CreateQueryPayloadType = {
  action: 'create'
  object: string
} & CreateQueryType
