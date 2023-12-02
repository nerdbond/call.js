export type HookCast<Task extends string, Load extends string> = {
  host: string
  deck: string
  code?: string
  task: Task
  load: Load // CallLoadCast
}
