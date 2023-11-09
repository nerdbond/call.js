import { ReadCallCast } from './read'
import { HaveCallCast } from './have'
import { SeekCallCast } from './seek'

export type SaveCallMoldCast = () => SaveCallCast

export type SaveCallCast = {
  seek?: SeekCallCast
  have?: HaveCallCast
  read?: ReadCallCast
}

export type SaveCallHaulCast = {
  task: 'save'
  like: string
} & SaveCallCast
