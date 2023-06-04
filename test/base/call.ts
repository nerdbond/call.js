import _ from 'lodash'

import type { CallBase } from '../../index.js'
import { readUser1 } from './read.js'

type WithId = { id: string }

type WithName = { name: string }

export const findUserById = ({ id }: WithId) => ({
  read: {
    ..._.merge(readUser1, {
      user: {
        find: {
          base: {
            link: 'id',
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
            link: 'name',
          },
          form: 'like' as const,
          head: name,
          test: 'bond' as const,
        },
      },
    }),
  },
})

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
