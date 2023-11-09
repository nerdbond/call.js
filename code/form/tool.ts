import { MakeCallCast } from './call/make'
import { ReadCallCast } from './call/read'
import { TossCallCast } from './call/toss'
import { LoadCallCast } from './call/load'
import { SaveCallCast } from './call/save'

export const TASK = ['make', 'load', 'save', 'toss', 'read']

export type CallCast = typeof TASK[number]

export type LoadCast = Record<string, any> | Array<Record<string, any>>

export type TaskMeshCast = {
  load?: (call: LoadCallCast) => Promise<LoadCast>
  make?: (call: MakeCallCast) => Promise<LoadCast>
  save?: (call: SaveCallCast) => Promise<LoadCast>
  toss?: (call: TossCallCast) => Promise<LoadCast>
  read?: (call: ReadCallCast) => Promise<LoadCast>
}

export type ToolCast = Record<string, TaskMeshCast>

export function isTaskMeshCast(name: string): name is CallCast {
  return TASK.includes(name)
}
