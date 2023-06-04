import { Base, Form, FormCode, FormSort } from '@tunebond/form'
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
  base: FormSort.Text,
  host: CODE_HOST,
  test: (bond: unknown) => /^[MNDBTKHSFVZXCWLR]+$/.test(bond as string),
} satisfies FormCode

const Email = {
  base: FormSort.Text,
  test: (bond: unknown) => emailValidator.validate(bond as string),
} satisfies FormCode

const User = {
  dock: 'id',
  link: {
    email: { form: 'text', void: true },
    slug: { form: 'text' },
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
    createdAt: { form: 'date', take: ['jan', 'feb'] },
    id: { form: 'code' },
    title: { form: 'text', size: { base: 3 } },
  },
  name: 'tl_post',
} satisfies Form

const Vote = {
  dock: 'id',
  link: {
    value: { form: 'mark', base: 100 },
    object: { form: ['user', 'post'], code: true },
  },
  name: 'tl_vote',
} satisfies Form

const FormBase = {
  email: Email,
  code: Code,
  post: Post,
  user: User,
  vote: Vote,
} satisfies Base

export default FormBase
