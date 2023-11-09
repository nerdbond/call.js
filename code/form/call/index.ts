import { MakeCallCast, MakeCallHaulCast } from './make'
import { TossCallCast, TossCallHaulCast } from './toss'
import { LoadCallHaulCast } from './load'
import { SaveCallCast, SaveCallHaulCast } from './save'

import * as Seek from './seek'

export type CallHaulCast =
  | MakeCallHaulCast
  | LoadCallHaulCast
  | SaveCallHaulCast
  | TossCallHaulCast

export type CallHaulMeshCast = Record<string, () => CallHaulCast>

export type MoveCallCast = MakeCallCast | SaveCallCast | TossCallCast

export * from './make'
export * from './read'
export * from './seek'
export * from './toss'
export * from './have'
export * from './load'
export * from './save'

export { Seek }
