/**
 * This is the structure created out of the read take.
 *
 * It is used to validate an incoming read.
 */

export type ReadTakeTree = {
  like: 'read-take-tree'
  // this is the schema used to check on it.
  link: Record<string, ReadTakeTreeLink>
  name: Record<string, ReadTakeTreeLink>
}

export type ReadTakeTreeLink = ReadTakeTreeLeaf | ReadTakeTree

export type ReadTakeTreeLeaf = {
  like: 'read-take-tree-leaf'
  form: string
}
