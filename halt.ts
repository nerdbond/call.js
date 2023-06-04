import Halt, { Link } from '@tunebond/halt'
import { make4 } from '@tunebond/tone-code'

type HaveName = {
  name: string
}

const host = '@tunebond/call'

const base = {
  form_miss: {
    code: 2,
    note: ({ name }: HaveName) => `Form '${name}' undefined`,
  },
}

type Base = typeof base

type Name = keyof Base

export const code = (code: number) => make4(BigInt(code))

export default function halt(form: Name, link: Link<Base, Name>) {
  return new Halt({ base, code, form, host, link })
}
