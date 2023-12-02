export type BaseCast = Record<string, BaseFormCast>

// simplified schema tailored to relational databases.
export type BaseFormCast = {
  name: string
  code?: Array<Array<string>>
  link: BaseFormLinkMeshCast
}

export type BaseFormLinkMeshCast = Record<string, BaseFormLinkCast>

export type BaseFormLinkCast = {
  like?: string
  base?: any // default
  trim?: boolean
  fill?: boolean // polymorphic
  take?: Array<any> // accept
  link?: BaseFormLinkMeshCast
  list?: boolean
  need?: boolean // required
  name?: string // other side of polymorphic association
  bind?: string | number | null | Record<string, string | number | null> // specify values
  back?: string
  size?: BaseFormLinkSizeCast
}

export type BaseFormLinkSizeCast =
  | number
  | {
      rise?: number
      fall?: number
      rise_meet?: number
      fall_meet?: number
      void?: number
    }
