export type CallTaskCast<Load extends string> = {
  take?: CallMeshTakeCast
  load?: Load
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
