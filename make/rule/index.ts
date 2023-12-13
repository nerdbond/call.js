import loveCode from '@wavebond/love-code'
import makeCast from './cast'
import { MakeTakeCast } from '../cast'

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
