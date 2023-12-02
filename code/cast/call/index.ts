import { MakeCallCast } from './make'
import { TossCallCast } from './toss'
import { SaveCallCast } from './save'
import { ReadCallCast } from './read'

import * as Find from './find'

export type MoveCallCast = MakeCallCast | SaveCallCast | TossCallCast

export type CallCast = MoveCallCast | ReadCallCast

export * from './make'
export * from './read'
export * from './find'
export * from './toss'
export * from './take'
export * from './read'
export * from './save'

export { Find }
