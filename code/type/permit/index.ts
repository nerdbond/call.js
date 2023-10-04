import { CreatePermitBuilderType, CreatePermitType } from './create'
import { ExtendPermitBuilderType, ExtendPermitType } from './extend'
import { RemovePermitBuilderType, RemovePermitType } from './remove'
import { UpdatePermitBuilderType, UpdatePermitType } from './update'

export type PermitBuilderMapType = Record<string, PermitBuilderType>

export type PermitBuilderType =
  | CreatePermitBuilderType
  | UpdatePermitBuilderType
  | ExtendPermitBuilderType
  | RemovePermitBuilderType

export type PermitType =
  | CreatePermitType
  | UpdatePermitType
  | ExtendPermitType
  | RemovePermitType

export * from './create'
export * from './extend'
export * from './filter'
export * from './remove'
export * from './update'
