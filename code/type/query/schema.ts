export type SchemaQueryMapType = {
  [key: string]: SchemaQueryValueType
}

export type SchemaQueryValueType =
  | string
  | number
  | boolean
  | null
  | Date
  | SchemaQueryMapType
