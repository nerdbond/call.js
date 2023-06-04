import _ from 'lodash'

import { readUser1 } from '../../read.js'
import { Task } from 'base.js'

type WithId = { id: string }

const load = ({ id }: WithId) => ({
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

export default {
  task: Task.Read,
  load,
  read: readUser1,
}
