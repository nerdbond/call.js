import { ReadCallCast } from './read'
import { SeekCallCast } from './seek'

export type TossCallMoldCast = () => TossCallCast

export type TossCallCast = {
  seek?: SeekCallCast
  read?: ReadCallCast
}

export type TossCallHaulCast = {
  task: 'toss'
  like: string
} & TossCallCast
