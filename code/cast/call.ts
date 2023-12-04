import { FormMeshCast } from './form'

export type CallTaskCast = {
  take?: CallMeshTakeCast
  load?: {
    like: string
  }
}

export type CallHostCast = {
  form?: FormMeshCast
  load?: CallLoadCast
  task?: CallTaskCast
}

export type CallMeshLoadCast = Record<string, boolean | CallLoadCast>

export type CallLoadCast = {
  size?: boolean
  stir?: boolean
  curb?: number
  take?: CallMeshTakeCast
  load?: CallMeshLoadCast
  case?: Record<string, CallLoadCast>
}

export type CallMeshTakeCast = {
  [name: string]: CallMeshTakeCast | string | number | boolean | null
}

export type CallCast = {
  find?: FormMeshCast
  load?: CallMeshLoadCast
  // curb?: number
  // sort: any
  take?: CallMeshTakeCast
}
