import { TaskCast } from './form'

export type ReadTaskMoldCast = () => ReadTaskCast

export type ReadTaskCast = TaskCast<'read'>
