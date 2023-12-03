export type FormCast = {
  case?: Array<FormLinkCast>
  link?: FormLinkMeshCast
}

export type FormMeshCast = Record<string, FormCast>

export type FormLinkMeshCast = Record<string, FormLinkCast>

export type FormLinkCast = {
  like?: string
  base?: any // default
  case?: Array<FormLinkCast>
  trim?: boolean
  fill?: boolean // polymorphic
  take?: Array<any> // accept
  link?: FormLinkMeshCast
  list?: boolean
  need?: boolean // required
  hold?: boolean // defaults to true if not list
  bind?:
    | string
    | number
    | boolean
    | null
    | Record<string, string | number | boolean | null> // specify values
  back?: string
  size?:
    | number
    | {
        rise?: number
        fall?: number
        rise_meet?: number
        fall_meet?: number
      }
}
