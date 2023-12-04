export type FormCast = {
  like?: string
  case?: Array<FormLinkCast>
  link?: FormLinkMeshCast
  test?: (bond: any, link?: any) => boolean
}

export type FormMeshCast = Record<string, FormCast>

export type FormLinkMeshCast = Record<string, FormLinkCast>

export type FormLinkCast = {
  like?: string
  base?: any // default
  test?: (bond: any, link?: any) => boolean
  case?: Array<FormLinkCast>
  trim?: boolean
  fill?: boolean // polymorphic
  take?: Array<any> // accept
  link?: FormLinkMeshCast
  list?: boolean
  need?: boolean // required
  hold?: boolean // defaults to true if not list
  bind?:
    | FormBondCast
    | Record<string, FormBondCast>
    | Array<FormBondCast> // specify values
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

export type FormBondCast = string | number | boolean | null
