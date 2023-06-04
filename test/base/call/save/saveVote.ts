import _ from 'lodash'

import { readUserBasic } from '../../read.js'
import { LoadTask } from '~/call/load.js'
import { Call } from '~/call/index.js'

type SaveVote = {
  value: number
  object: {
    type: string
    id: string
  }
}

const load = ({ value, object }: SaveVote) => ({
  move: {
    vote: {
      move: {
        value,
        object: {
          move: {
            type: object.type,
            id: object.id,
          },
        },
      },
    },
  },
  read: readUserBasic,
})

export default {
  task: LoadTask.Save,
  load,
  read: readUserBasic,
} satisfies Call
