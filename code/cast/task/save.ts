import { TaskCast } from './form'

export type SaveTaskMoldCast = () => SaveTaskCast

export type SaveTaskCast = TaskCast<'save'>
