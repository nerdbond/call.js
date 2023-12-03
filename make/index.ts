import { MakeTakeCast } from './cast'
import makeCall from './call'
import makeLoad from './load'

export default async function make(take: MakeTakeCast) {
  const call = await makeCall(take)
  const load = await makeLoad(take)

  return { call, load }
}
