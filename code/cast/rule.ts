export type RuleTaskMeshCast = Record<string, RuleTaskCast>

export type RuleTaskCast = {
  take?: RuleLinkMeshCast
  like?: string
  load?: {
    like: string
  }
}

export type RuleLoadMeshCast = Record<string, RuleLoadCast>

export type RuleLoadCast = {
  back?: string
  load: RuleMeshLoadCast
}

export type RuleMeshLoadCast = Record<
  string,
  boolean | RuleLoadLinkCast
>

export type RuleLoadLinkCast = {
  size?: boolean
  stir?: boolean
  curb?: number
  take?: RuleLinkMeshCast
  load?: RuleMeshLoadCast
  case?: Record<string, RuleLoadLinkCast>
}

export type RuleLinkMeshCast = Record<string, RuleLinkCast>

export type RuleLinkCast = {
  like?: string
  base?: any // default
  case?: Array<RuleLinkCast>
  trim?: boolean
  fill?: boolean // polymorphic
  take?: Array<any> // accept
  link?: RuleLinkMeshCast
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
