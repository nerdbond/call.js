import fs from 'fs'

import type { BaseForm } from '@tunebond/form.js'

import { Base, make } from '../make.js'
import _ from 'lodash'

type WithId = { id: string }

export const readUser1 = {
  user: {
    read: {
      email: true,
      id: true,
      name: true,
      posts: {
        list: true,
        read: {
          size: true,
        },
      },
    },
  },
}

export const findUserById = ({ id }: WithId) =>
  ({
    read: {
      ..._.merge(readUser1, {
        user: {
          find: {
            base: {
              link: 'user/name'
            },
            form: 'like' as const,
            head: id,
            test: 'bond' as const,
          },
        },
      }),
    }
  })

const Call: Base = {
  findUserById: {
    load: findUserById,
    read: readUser1,
  },
}

const User: BaseForm = {
  dock: 'id',
  link: {
    email: { form: 'text', void: true },
    id: { form: 'uuid' },
    name: { form: 'text' },
    posts: { back: 'author', form: 'post', list: true },
  },
}

const Post: BaseForm = {
  dock: 'id',
  link: {
    author: { form: 'user', link: { form: 'uuid', name: 'authorId' } },
    content: { form: 'text' },
    createdAt: { form: 'date' },
    id: { form: 'uuid' },
    title: { baseSize: 3, form: 'text' },
  },
}

const Base = {
  post: Post,
  user: User,
}

start()

async function start() {
  const call = await make(Call, Base)
  fs.writeFileSync('./test/host/call.ts', call)
}
