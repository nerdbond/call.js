export type TaskCast<Call extends string> = {
  host: string
  deck: string
  code: string
  name: string
  call: Call
}
