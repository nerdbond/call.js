import { FilterPermitPropertyType } from './permit/filter'

export type SchemaType = {
  name: string
  primary: string
  property: SchemaMapType
}

export type SchemaMapType = Record<string, SchemaPropertyType>

export type SchemaPropertyContainerType =
  | SchemaType
  | SchemaPropertyType
  | FilterPermitPropertyType

export type SchemaPropertyType = {
  type: string
  default?: any
  trim?: boolean
  accept?: Array<any>
  property?: SchemaMapType
  list?: boolean
  optional?: boolean
  reference?: boolean
}
