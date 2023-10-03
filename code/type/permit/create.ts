import { SchemaMapType } from '../schema'

export type CreatePermitBuilderType = () => CreatePermitType

export type CreatePermitType = {
  effect?: SchemaMapType
  extend?: string
}
