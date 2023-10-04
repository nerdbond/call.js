import { FilterPermitType } from './filter'

export type RemovePermitBuilderType = () => RemovePermitType

export type RemovePermitType = {
  filter?: FilterPermitType
  extend?: string
}
