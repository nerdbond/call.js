export type MeshBaseCast = Record<string, MeshFormCast>

// simplified schema tailored to relational databases.
export type MeshFormCast = {
  name: string
  code?: Array<Array<string>>
  link: MeshFormLinkMeshCast
}

export type MeshFormLinkMeshCast = Record<string, MeshFormLinkCast>

export type MeshFormLinkCast = {
  like?: string
  base?: any // default
  trim?: boolean
  fill?: boolean // polymorphic
  take?: Array<any> // accept
  link?: MeshFormLinkMeshCast
  list?: boolean
  need?: boolean // required
  name?: string // other side of polymorphic association
  bind?:
    | string
    | number
    | boolean
    | null
    | Record<string, string | number | boolean | null> // specify values
  back?: string
  size?: MeshFormLinkSizeCast
}

export type MeshFormLinkSizeCast =
  | number
  | {
      rise?: number
      fall?: number
      rise_meet?: number
      fall_meet?: number
      void?: number
    }
