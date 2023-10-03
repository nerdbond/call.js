import { CreatePermitBuilderType, CreatePermitType } from './create'
import { RemovePermitBuilderType, RemovePermitType } from './remove'
import { UpdatePermitBuilderType, UpdatePermitType } from './update'

export type MutatePermitBuilderMapType = Record<
  string,
  MutatePermitBuilderType
>

export type MutatePermitBuilderType =
  | CreatePermitBuilderType
  | UpdatePermitBuilderType
  | RemovePermitBuilderType

export type MutatePermitType =
  | CreatePermitType
  | UpdatePermitType
  | RemovePermitType
