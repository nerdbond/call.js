import { HaltMesh } from '@tunebond/halt'
import { Base } from '~/base/index.js'
import makeTakeRead from './read.js'

export default function make(base: Base) {
  const haltList: Array<HaltMesh> = []
  const read = makeTakeRead(base, haltList)

  return {
    read,
  }
}
