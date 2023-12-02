import { ReadCallCast } from './read'
import { TakeCallCast } from './take'
import { FindCallCast } from './find'

export type SaveCallCast = {
  find?: FindCallCast
  take?: TakeCallCast
  load?: ReadCallCast
}
