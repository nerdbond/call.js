import { ReadCallCast } from './read'
import { HaveCallCast } from './have'

export type MakeCallMoldCast = () => MakeCallCast

export type MakeCallCast = {
  have?: HaveCallCast
  read?: ReadCallCast
}

export type MakeCallHaulCast = {
  task: 'make'
  like: string
} & MakeCallCast
