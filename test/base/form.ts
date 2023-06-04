import type { Base, Form, FormCode } from '@tunebond/form'
import { formCodeHost, formHostCode } from '@tunebond/tone-code'
import emailValidator from 'email-validator'

const CODE_HOST = {
  face: {
    baseSelf: formHostCode,
  },
  site: {
    headSelf: formCodeHost,
  },
}

const Code = {
  base: 'text',
  host: CODE_HOST,
  test: (bond: unknown) => /^[MNDBTKHSFVZXCWLR]+$/.test(bond as string),
} satisfies FormCode

const Email = {
  base: 'text',
  test: (bond: unknown) => emailValidator.validate(bond as string),
} satisfies FormCode

const User = {
  dock: 'id',
  link: {
    email: { form: 'text', void: true },
    id: { form: 'code' },
    name: { form: 'text' },
    posts: { back: 'author', form: 'post', list: true },
  },
  name: 'tl_user',
} satisfies Form

const Post = {
  dock: 'id',
  link: {
    author: { form: 'user', site: { form: 'code', name: 'authorId' } },
    content: { form: 'text' },
    createdAt: { form: 'date' },
    id: { form: 'code' },
    title: { form: 'text', size: { base: 3 } },
  },
  name: 'tl_post',
} satisfies Form

const FormBase = {
  email: Email,
  code: Code,
  post: Post,
  user: User,
} satisfies Base

export default FormBase
