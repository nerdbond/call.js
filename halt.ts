import { FormLinkSize } from '@tunebond/form'
import Halt, { Link } from '@tunebond/halt'
import { make4 } from '@tunebond/tone-code'

export type HaveBase = {
  line?: Array<string | number>
  name?: string
  lead?: unknown
  need?: FormLinkSize | Array<string> | unknown
}

const host = '@tunebond/call'

const base = {
  form_miss: {
    code: 2,
    note: (link: HaveBase) => `Form is undefined.`,
  },
  link_need: {
    code: 3,
    note: (link: HaveBase) => `Link is required.`,
  },
  link_size: {
    code: 4,
    note: (link: HaveBase) => `Link size out of bounds.`,
  },
  link_take: {
    code: 5,
    note: (link: HaveBase) => `Link provided invalid value.`,
  },
  link_form: {
    code: 6,
    note: (link: HaveBase) => `Link is invalid form.`,
  },
}

export type HaltBase = typeof base

export type HaltBaseName = keyof HaltBase

export const code = (code: number) => make4(BigInt(code))

export default function halt(
  form: HaltBaseName,
  { name, ...link }: Link<HaltBase, HaltBaseName>,
) {
  if (name) {
    link.line = [name]
  }

  return new Halt({ base, code, form, host, link })
}
