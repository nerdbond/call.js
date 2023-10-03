import { SchemaFilterPossibleType } from '../schema'

export type ExtendPermitBuilderMapType = Record<
  string,
  ExtendPermitBuilderType
>

export type ExtendPermitBuilderType = () => ExtendPermitType

export type ExtendPermitType = {
  [key: string]: ExtendPermitValueType
}

export type ExtendPermitValueType = boolean | ExtendPermitContainerType

export type ExtendPermitContainerType = {
  total?: boolean
  page?: boolean
  randomize?: boolean
  single?: boolean
  filter?: SchemaFilterPossibleType
  extend?: ExtendPermitType
  case?: Record<string, ExtendPermitContainerType>
}

export type ExtendMapPayloadType = Record<
  string,
  ExtendBuilderPayloadType
>

export type ExtendBuilderPayloadType = () => ExtendPermitPayloadType

export type ExtendPermitPayloadType = {
  object: string
  action: string
} & ExtendPermitContainerType
