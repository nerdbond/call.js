import { SchemaQueryMapType } from './schema'

export type ExtendQueryBuilderType = () => ExtendQueryType

export type ExtendQueryType = {
  [key: string]: ExtendQuerySchemaValueType
}

export type ExtendQueryContainerType = {
  filter?: SchemaQueryMapType
  extend?: ExtendQueryType
  total?: boolean
  randomize?: boolean
  case?: Record<string, ExtendQueryContainerType>
}

export type ExtendQuerySchemaValueType =
  | boolean
  | ExtendQueryContainerType
