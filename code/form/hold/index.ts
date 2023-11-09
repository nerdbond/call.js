import { MakeHoldMoldCast, MakeHoldCast } from './make'
import { ReadHoldMoldCast, ReadHoldCast } from './read'
import { TossHoldMoldCast, TossHoldCast } from './toss'
import { SaveHoldMoldCast, SaveHoldCast } from './save'

export type HoldMoldMeshCast = Record<string, HoldMoldCast>

export type HoldMoldCast =
  | MakeHoldMoldCast
  | SaveHoldMoldCast
  | ReadHoldMoldCast
  | TossHoldMoldCast

export type HoldCast =
  | MakeHoldCast
  | SaveHoldCast
  | ReadHoldCast
  | TossHoldCast

export type MoveHoldCast = MakeHoldCast | SaveHoldCast | TossHoldCast

export * from './make'
export * from './read'
export * from './seek'
export * from './toss'
export * from './save'
