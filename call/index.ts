import { Load, LoadRead, LoadTask } from './load'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Call = {
  task: LoadTask
  load: (link: any) => Load
  read?: LoadRead
}

export * from './load'
