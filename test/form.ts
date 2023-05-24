import type { BaseForm } from '@tunebond/form.js'

const User: BaseForm = {
  dock: 'id',
  link: {
    email: { form: 'text', void: true },
    id: { form: 'code' },
    name: { form: 'text' },
    posts: { back: 'author', form: 'post', list: true },
  },
}

const Post: BaseForm = {
  dock: 'id',
  link: {
    author: { form: 'user', link: { form: 'code', name: 'authorId' } },
    content: { form: 'text' },
    createdAt: { form: 'date' },
    id: { form: 'code' },
    title: { baseSize: 3, form: 'text' },
  },
}

const FormBase = {
  post: Post,
  user: User,
}

export default FormBase
