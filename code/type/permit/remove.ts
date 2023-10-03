import { FilterPermitQuery } from './filter'

export type RemovePermitBuilderType = () => RemovePermitType

export type RemovePermitType = {
  filter?: FilterPermitQuery
  extend?: string
}
