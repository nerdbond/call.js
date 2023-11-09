export type HaveCallCast = {
  [key: string]: HaveCallBondCast
}

export type HaveCallBondCast =
  | string
  | number
  | boolean
  | null
  | Date
  | HaveCallCast
