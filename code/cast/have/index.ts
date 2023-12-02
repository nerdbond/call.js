import { MakeHaveMoldCast, MakeHaveCast } from './make'
import { ReadHaveMoldCast, ReadHaveCast } from './read'
import { TossHaveMoldCast, TossHaveCast } from './toss'
import { SaveHaveMoldCast, SaveHaveCast } from './save'

export type HaveMoldMeshCast = Record<string, HaveMoldCast>

export type HaveMoldCast =
  | MakeHaveMoldCast
  | SaveHaveMoldCast
  | ReadHaveMoldCast
  | TossHaveMoldCast

export type HaveCast =
  | MakeHaveCast
  | SaveHaveCast
  | ReadHaveCast
  | TossHaveCast

export type MoveHaveCast = MakeHaveCast | SaveHaveCast | TossHaveCast

export * from './make'
export * from './read'
export * from './seek'
export * from './toss'
export * from './save'
