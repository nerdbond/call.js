import _ from 'lodash'

import { readUserBasic } from '../../read.js'
import { Task } from 'base.js'

type MakeUser = {
  email: string
  slug: string
}

const load = ({ email, slug }: MakeUser) => ({
  link: {
    email,
    slug,
  },
  read: readUserBasic,
})

export default {
  load,
  task: Task.Save,
  read: readUserBasic,
}
