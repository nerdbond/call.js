import { TaskCast } from './form'

export type TossTaskMoldCast = () => TossTaskCast

export type TossTaskCast = TaskCast<'toss'>
