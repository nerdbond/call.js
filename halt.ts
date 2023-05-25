import Halt, { Link } from '@tunebond/halt'

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

export default function halt(form: Name, link: Link<Base, Name>) {
  return new Halt({ base, form, host, link })
}
