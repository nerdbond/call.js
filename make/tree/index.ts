import love_code from '@wavebond/love-code'
import make_cast from './cast'
import make_take from './take'
import { MakeTakeCast } from '../cast'

export default async function make(take: MakeTakeCast) {
  const cast_list: Array<string> = []
  cast_list.push(...make_cast(take))

  const take_list: Array<string> = []
  take_list.push(...make_take(take))

  const cast = await love_code(cast_list.join('\n'))
  const take_text = await love_code(take_list.join('\n'))
  return { cast, take: take_text }
}
