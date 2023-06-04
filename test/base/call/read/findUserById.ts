import _ from 'lodash'

import { readUser1 } from '../../read.js'
import { LoadTask } from '~/call/load.js'
import { Call } from '~/call/index.js'

type WithId = { id: string }

const load = ({ id }: WithId) => ({
  read: {
    ..._.merge(readUser1, {
      user: {
        read: {
          list: {
            find: {
              base: {
                link: 'id',
              },
              form: 'like' as const,
              head: id,
              test: 'bond' as const,
            },
          },
        },
      },
    }),
  },
})

export default {
  task: LoadTask.Read,
  load,
  read: readUser1,
} satisfies Call
