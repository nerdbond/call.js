import { ReadCallCast } from './read'
import { TakeCallCast } from './take'

export type MakeCallCast = {
  take?: TakeCallCast
  load?: ReadCallCast
}
