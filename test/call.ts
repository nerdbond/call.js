import _ from 'lodash'

import type { CallBase } from '../index.js'

type WithId = { id: string }

type WithName = { name: string }

const userPosts = {
  posts: {
    list: true,
    read: {
      list: {
        read: {
          author: {
            read: {
              id: true,
            },
          },
          id: true,
          title: true,
        },
      },
      size: true,
    },
  },
}

export const findUserById = ({ id }: WithId) => ({
  read: {
    ..._.merge(readUser1, {
      user: {
        find: {
          base: {
            link: 'user/id',
          },
          form: 'like' as const,
          head: id,
          test: 'bond' as const,
        },
      },
    }),
  },
})

export const findUserByName = ({ name }: WithName) => ({
  read: {
    ..._.merge(readUser1, {
      user: {
        find: {
          base: {
            link: 'user/name',
          },
          form: 'like' as const,
          head: name,
          test: 'bond' as const,
        },
      },
    }),
  },
})

export const readUser1 = {
  user: {
    read: {
      email: true,
      id: true,
      name: true,
      ...userPosts,
    },
  },
}

const CallBase = {
  findUserById: {
    load: findUserById,
    read: readUser1,
  },
  findUserByName: {
    load: findUserByName,
    read: readUser1,
  },
} satisfies CallBase

export default CallBase
