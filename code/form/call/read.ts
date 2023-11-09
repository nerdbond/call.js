import { SeekCallCast } from './seek'

export type ReadCallMoldCast = () => ReadCallCast

export type ReadCallCast = {
  [key: string]: ReadCallBondCast
}

export type ReadCallBaseCast = {
  seek?: SeekCallCast
  read?: ReadCallCast
  size?: boolean
  stir?: boolean
  case?: Record<string, ReadCallBaseCast>
}

export type ReadCallBondCast = boolean | ReadCallBaseCast
