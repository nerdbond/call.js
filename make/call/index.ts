import loveCode from '@wavebond/love-code'
import {
  FormMeshCast,
  MeshBaseCast,
  RuleLoadMeshCast,
  RuleTaskMeshCast,
} from '~/code/cast'
import makeCast from './cast'

export type MakeTakeCast = {
  rule: {
    task: RuleTaskMeshCast
    load: RuleLoadMeshCast
  }
  call: {
    task: RuleTaskMeshCast
    load: RuleLoadMeshCast
  }
  mesh: MeshBaseCast
  cast: FormMeshCast
}

export default async function make(take: MakeTakeCast) {
  const textList: Array<string> = []

  for (const name in take.call.task) {
    const task = take.call.task[name]
    const nameTextList = await makeCast(task)
    textList.push(...nameTextList)
  }

  const text = await loveCode(textList.join('\n'))
  return text
}
