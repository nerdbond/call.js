import { SchemaFilterPossibleType } from '../schema'

export type RemovePermitBuilderType = () => RemovePermitType

export type RemovePermitType = {
  filter?: SchemaFilterPossibleType
  select?: string
}
