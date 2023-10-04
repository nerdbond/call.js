import { CreateQueryType } from './query/create'
import { ExtendQueryType } from './query/extend'
import { RemoveQueryType } from './query/remove'
import { SelectQueryType } from './query/select'
import { UpdateQueryType } from './query/update'

export const ACTION = ['create', 'select', 'update', 'remove', 'extend']

export type ActionType = typeof ACTION[number]

export type ResponseType =
  | Record<string, any>
  | Array<Record<string, any>>

export type ResourceType = {
  select: (source: SelectQueryType) => Promise<ResponseType>
  create: (source: CreateQueryType) => Promise<ResponseType>
  update: (source: UpdateQueryType) => Promise<ResponseType>
  remove: (source: RemoveQueryType) => Promise<ResponseType>
  extend: (source: ExtendQueryType) => Promise<ResponseType>
}

export type ModelType = Record<string, ResourceType>

export function isValidAction(name: string): name is ActionType {
  return ACTION.includes(name)
}
