import { SeekHoldLinkCast } from './hold/seek'

export type FormCast = {
  name: string
  hook: string
  link: FormMeshCast
}

export type FormMeshCast = Record<string, FormLinkCast>

export type FormLinkBaseCast =
  | FormCast
  | FormLinkCast
  | SeekHoldLinkCast

export type FormLinkCast = {
  like: string
  fill?: any // default
  trim?: boolean
  have?: Array<any> // accept
  link?: FormMeshCast
  list?: boolean
  need?: boolean // required
  bind?: boolean
}
