import _ from 'lodash'

import { readUser1 } from '../../read.js'
import { LoadTask } from '~/call/load.js'
import { Call } from '~/call/index.js'

type WithName = { name: string }

const load = ({ name }: WithName) => ({
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

export default {
  load,
  read: readUser1,
  task: LoadTask.Read,
} satisfies Call
