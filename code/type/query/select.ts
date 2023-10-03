import { ExtendQueryType } from './extend'

export type SelectQueryPayloadType = {
  action: 'select'
  object: string
  extend: ExtendQueryType
}
