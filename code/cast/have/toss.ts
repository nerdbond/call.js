import { ReadHaveCast } from './read'
import { SeekHaveCast } from './seek'

export type TossHaveMoldCast = () => TossHaveCast

export type TossHaveCast = {
  seek?: SeekHaveCast
  load?: ReadHaveCast
}
