/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Base as FormBase } from '@tunebond/form'
import { Call } from '../call/index.js'

export type CallBase = Record<string, Call>

export type { FormBase }

export type Base = {
  call: CallBase
  form: FormBase
  read: ReadTakeBase
  save: SaveTakeBase
}

export type ReadTakeBase = {
  [name: string]: boolean | ReadTakeBaseLink
}

export type ReadTakeBaseLink = {
  read?: ReadTakeBase
  name?: ReadTakeBase
}

export type SaveTakeBase = {
  [name: string]: boolean | SaveTakeBase
}

export type Prefixed<P extends string, T> = {
  [K in keyof T as K extends string ? `${P}${K}` : never]: T[K]
}

export type MoldBase<T> = {
  [K in keyof T]: {
    [K2 in keyof T[K]]: 'form' extends keyof T[K][K2]
      ? T[K][K2]['form'] extends keyof TextFormLink
        ? TextFormLink[T[K][K2]['form']]
        : T[K][K2]
      : T[K][K2]
  }
}

export type TextFormLink = {
  boolean: boolean
  number: number
  string: string
}

export type MakeForm<T> = {
  [K in keyof T]: {
    [K2 in keyof T[K]]: 'form' extends keyof T[K][K2]
      ? T[K][K2]['form'] extends keyof TextFormLink
        ? TextFormLink[T[K][K2]['form']]
        : T[K][K2] extends {
            form: ReadonlyArray<unknown>
            list: boolean
          }
        ? Array<
            TextFormLink[T[K][K2]['form'][number] & keyof TextFormLink]
          >
        : T[K][K2]['form']
      : T[K][K2]
  }
}
