import { MakeCallCast } from './call/make'
import { TossCallCast } from './call/toss'
import { SaveCallCast } from './call/save'
import { ReadCallCast } from './call/read'

export const TASK = ['make', 'save', 'toss', 'read']

export type TaskNameCast = typeof TASK[number]

export type LoadCast = Record<string, any> | Array<Record<string, any>>

export type TaskMeshCast = {
  make?: (call: MakeCallCast) => Promise<LoadCast>
  save?: (call: SaveCallCast) => Promise<LoadCast>
  toss?: (call: TossCallCast) => Promise<LoadCast>
  read?: (call: ReadCallCast) => Promise<LoadCast>
}

export type ToolCast = Record<string, TaskMeshCast>

export function testTaskMeshCast(name: string): name is TaskNameCast {
  return TASK.includes(name)
}
