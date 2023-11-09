import { FilterPermitType } from './filter'

export type ExtendPermitBuilderType = () => ExtendPermitType

export type ExtendPermitObjectType = {
  [key: string]: ExtendPermitValueType
}

export type ExtendPermitValueType = boolean | ExtendPermitType

export type ExtendPermitType = {
  filter?: FilterPermitType
  extend?: ExtendPermitObjectType
  case?: Record<string, ExtendPermitType>
}
