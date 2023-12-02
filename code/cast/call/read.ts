import { FindCallCast } from './find'

export type ReadCallCast = {
  [key: string]: ReadCallBondCast
}

export type ReadCallBaseCast = {
  find?: FindCallCast
  load?: ReadCallCast
  size?: boolean
  // randomize
  stir?: boolean
  case?: Record<string, ReadCallBaseCast>
}

export type ReadCallBondCast = boolean | ReadCallBaseCast
