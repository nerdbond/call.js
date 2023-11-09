import { ReadCallCast } from './read'
import { SeekCallCast } from './seek'

export type LoadCallHaulCast = {
  task: 'load'
  like: string
} & LoadCallCast

export type LoadCallCast = {
  seek?: SeekCallCast
  read: ReadCallCast
}
