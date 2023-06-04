/* eslint-disable @typescript-eslint/no-namespace */
import fetch from 'cross-fetch'
import base, { Base } from '../../base/index.js'
export namespace Form {
  export type FindUserById = {
    user: {
      email?: string
      id: string
      name: string
      posts: {
        size: number
        list: Array<{
          author: {
            id: string
          }
          id: string
          title: string
        }>
      }
    }
  }
  export type FindUserByName = {
    user: {
      email?: string
      id: string
      name: string
      posts: {
        size: number
        list: Array<{
          author: {
            id: string
          }
          id: string
          title: string
        }>
      }
    }
  }
}
export type Base = {
  findUserById: Form.FindUserById
  findUserByName: Form.FindUserByName
}
export type Name = keyof Base
export default async function call<Name extends Call.Name>(
  host: string,
  name: Name,
  link: Parameters<Base['call'][Name]['load']>[0],
) {
  const call = base.call[name]
  const loadBase = await call.load(link)
  const callHead = await fetch(host, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(loadBase),
  })
  if (callHead.status >= 400) {
    throw new Error(`Status ${callHead.status}`)
  }
  const loadHead = await callHead.json()
  return loadHead
}
