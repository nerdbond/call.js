import { ExtendQueryContainerType } from './extend'

export type GatherQueryPayloadType = {
  action: 'gather'
  object: string
} & ExtendQueryContainerType
