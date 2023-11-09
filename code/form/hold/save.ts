import { FormCast } from '../form'
import { SeekHoldCast } from './seek'

export type SaveHoldMoldCast = () => SaveHoldCast

export type SaveHoldCast = {
  seek?: SeekHoldCast
  have?: FormCast
  read?: string
}
