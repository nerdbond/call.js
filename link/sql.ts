import { LoadFind, LoadSort } from '../index.js'

export type DiffCall = {
  base: string
  find: Array<LoadFind>
  link: Array<Link> // joins
}

export type Link = {
  base: {
    form: string
    name: string
  }
  head: {
    form: string
    name: string
  }
}

export type ReadCall = {
  find?: LoadFind
  form: 'read-call'
  link: Array<Link>
  name: string // joins
  read: Array<string>
  sort: Array<LoadSort>
}

export function makeDiffCall() {}
export function makeMakeCall() {}
export function makeReadCall() {}
export function makeTestCall() {}
