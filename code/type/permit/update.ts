import { SchemaFilterPossibleType, SchemaMapType } from '../schema'

export type UpdatePermitBuilderType = () => UpdatePermitType

export type UpdatePermitType = {
  filter?: SchemaFilterPossibleType
  effect?: SchemaMapType
  extend?: string
}
