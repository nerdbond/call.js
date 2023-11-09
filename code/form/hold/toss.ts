import { SeekHoldCast } from './seek'

export type TossHoldMoldCast = () => TossHoldCast

export type TossHoldCast = {
  seek?: SeekHoldCast
  read?: string
}
