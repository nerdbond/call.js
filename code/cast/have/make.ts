import { FormCast } from '../form'
import { ReadHaveCast } from './read'

export type MakeHaveMoldCast = () => MakeHaveCast

export type MakeHaveCast = {
  take?: FormCast
} & Omit<ReadHaveCast, 'seek'>
