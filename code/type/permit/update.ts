import { SchemaMapType } from '../schema'
import { FilterPermitQuery } from './filter'

export type UpdatePermitBuilderType = () => UpdatePermitType

export type UpdatePermitType = {
  filter?: FilterPermitQuery
  effect?: SchemaMapType
  extend?: string
}
