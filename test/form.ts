import type { Base, Form } from '@tunebond/form'

const User = {
  dock: 'id',
  link: {
    email: { form: 'text', void: true },
    id: { form: 'code' },
    name: { form: 'text' },
    posts: { back: 'author', form: 'post', list: true },
  },
  name: 'tl_user',
} as const

const Post = {
  dock: 'id',
  link: {
    author: { form: 'user', link: { form: 'code', name: 'authorId' } },
    content: { form: 'text' },
    createdAt: { form: 'date' },
    id: { form: 'code' },
    title: { baseSize: 3, form: 'text' },
  },
  name: 'tl_post',
} as const

const FormBase = {
  post: Post,
  user: User,
} satisfies Base

export default FormBase
