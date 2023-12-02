import { FormCast } from '../form'
import { ReadHaveCast } from './read'
import { SeekHaveCast } from './seek'

export type SaveHaveMoldCast = () => SaveHaveCast

export type SaveHaveCast = {
  seek?: SeekHaveCast
  take?: FormCast
  read?: ReadHaveCast
}
