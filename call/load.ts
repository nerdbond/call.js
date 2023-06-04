export enum LoadTask {
  Move = 'move',
  Save = 'save',
  Read = 'read',
  Kill = 'kill',
  Link = 'link', // connect/attach
  Nick = 'nick', // disconnect/detach
}

export const LOAD_FIND_TEST = [
  'bond',
  'base_link_mark',
  'head_link_mark',
  'base_mark',
  'head_mark',
  // 'base_text',
  // 'head_text',
  'miss_bond',
  'have_bond',
  'have_text',
] as const

export type Load = {
  read?: LoadRead
  move?: LoadMove
}

export type LoadFind = LoadFindLink

export type LoadFindBind = {
  form: 'bind' // and
  list: Array<LoadFindLink>
}

export type LoadFindLike = {
  base: LoadFindLikeLinkBond
  form: 'like' // test
  head: LoadBond | LoadFindLikeLinkBond
  test: LoadFindTest
}

export type LoadBond = string | boolean | null | number

export type LoadFindLikeLinkBond = {
  link: string
}

export type LoadFindLink = LoadFindLike | LoadFindRoll | LoadFindBind

export type LoadFindRoll = {
  form: 'roll' // or
  list: Array<LoadFindLink>
}

export type LoadFindTest = typeof LOAD_FIND_TEST[number]

export type LoadRead = {
  [key: string]: boolean | LoadReadLink
}

export type LoadReadLink = {
  find?: LoadFind
  list?: boolean
  read: LoadRead
  // sort?: LoadSort
}

export type LoadMove = {
  [key: string]: Array<LoadMoveBase> | LoadMoveBase | LoadBond
}

export type LoadMoveBase = {
  task?: LoadTask
  find?: LoadFind
  move?: LoadMove
}

export type LoadSort = {
  link: string
  tilt: LoadTilt
}

export type LoadTilt = 'rise' | 'fall'
