import _ from 'lodash'

import type { CallBase } from '../../../base.js'
import findUserById from './read/findUserById.js'
import makeUser from './save/makeUser.js'
import findUserByName from './read/findUserByName.js'

const CallBase = {
  findUserById,
  makeUser,
  findUserByName,
} satisfies CallBase

export default CallBase
