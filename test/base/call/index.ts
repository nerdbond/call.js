import _ from 'lodash'

import type { CallBase } from '~/base/index.js'
import findUserById from './read/findUserById.js'
import makeUser from './save/makeUser.js'
import saveVote from './save/saveVote.js'
import findUserByName from './read/findUserByName.js'

const CallBase = {
  findUserById,
  makeUser,
  saveVote,
  findUserByName,
} satisfies CallBase

export default CallBase
