export type TakeCallCast = {
  [key: string]: TakeCallBondCast
}

export type TakeCallBondCast =
  | string
  | number
  | boolean
  | null
  | Date
  | TakeCallCast
