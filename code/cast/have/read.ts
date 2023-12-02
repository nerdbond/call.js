import { SeekHaveCast } from './seek'

export type ReadHaveMoldCast = () => ReadHaveCast

export type ReadHaveMeshCast = {
  [key: string]: ReadHaveBondCast
}

export type ReadHaveBondCast = boolean | ReadHaveCast

export type ReadHaveCast = {
  seek?: SeekHaveCast
  load?: ReadHaveMeshCast
  case?: Record<string, ReadHaveCast>
}
