import { SeekHoldCast } from './seek'

export type ReadHoldMoldCast = () => ReadHoldCast

export type ReadHoldMeshCast = {
  [key: string]: ReadHoldBondCast
}

export type ReadHoldBondCast = boolean | ReadHoldCast

export type ReadHoldCast = {
  seek?: SeekHoldCast
  read?: ReadHoldMeshCast
  case?: Record<string, ReadHoldCast>
}
