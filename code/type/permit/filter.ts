export type FilterPermitTestType =
  | '>='
  | '>'
  | '<='
  | '<'
  | 'start'
  | 'end'
  | 'match'
  | '='
  | '!='
  | 'in'

export type FilterPermitType =
  | FilterPermitObjectType
  | Array<FilterPermitObjectType>

export type FilterPermitObjectType = {
  [key: string]: FilterPermitPropertyType
}

export type FilterPermitPropertyType = {
  type?: string
  optional?: boolean
  test?: FilterPermitTestType | Array<FilterPermitTestType>
  property?: FilterPermitPropertyType
}
