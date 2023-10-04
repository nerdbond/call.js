import { SchemaMapType } from '../schema'
import { FilterPermitType } from './filter'

export type UpdatePermitBuilderType = () => UpdatePermitType

export type UpdatePermitType = {
  filter?: FilterPermitType
  effect?: SchemaMapType
  extend?: string
}
