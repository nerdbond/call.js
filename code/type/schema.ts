export type SchemaType = {
  name: string
  property: SchemaMapType
}

export type SchemaMapType = Record<string, SchemaPropertyType>

export type SchemaPropertyContainerType =
  | SchemaType
  | SchemaPropertyType

export type SchemaPropertyType = {
  type: string
  default?: any
  trim?: boolean
  accept?: Array<any>
  primary?: boolean
  property?: SchemaMapType
  list?: boolean
  optional?: boolean
  reference?: boolean
}

export type SchemaFilterPossibleType =
  | SchemaMapType
  | Array<SchemaMapType>
