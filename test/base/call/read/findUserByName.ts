import _ from 'lodash'

import { readUser1 } from '../../read.js'
import { Task } from 'base.js'

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
  task: Task.Read,
}
