import { HaltMesh } from '~/../halt.js/host/index.js'
import base from './base/index.js'
import makeRead from '~/base/take/read'
import makeCall from '~/call/make.js'
import findUserById from './base/call/read/findUserById.js'

const list: Array<HaltMesh> = []
const tree = makeRead(base, list)
if (list.length) {
  console.log(list)
}
// console.log(JSON.stringify(tree, null, 2))
const load = findUserById.load({ id: '123' })
console.log(JSON.stringify(load, null, 2))

const { halt, head } = makeCall(load, { link: { read: tree } })

if (halt.length) {
  console.log(halt)
}

console.log(JSON.stringify(head, null, 2))
