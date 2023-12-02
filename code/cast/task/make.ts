import { TaskCast } from './form'

export type MakeTaskMoldCast = () => MakeTaskCast

export type MakeTaskCast = TaskCast<'make'>
