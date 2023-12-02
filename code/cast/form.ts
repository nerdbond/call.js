import { SeekHaveLinkCast } from './have/seek'

export type FormCast = {
  name: string
  code?: Array<Array<string>>
  case?: Array<string>
  link: FormMeshCast
}

export type FormMeshCast = Record<string, FormLinkCast>

export type FormLinkBaseCast =
  | FormCast
  | FormLinkCast
  | SeekHaveLinkCast

export type FormLinkCast = {
  like?: string
  base?: any // default
  trim?: boolean
  fill?: boolean // polymorphic
  have?: Array<any> // accept
  link?: FormMeshCast
  list?: boolean
  need?: boolean // required
  bind?: Record<string, any> // specify values
  back?: string
}
