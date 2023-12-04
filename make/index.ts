import { MakeTakeCast } from './cast'
import make_call from './call'
import make_load from './load'
import make_form from './form'
import make_tree from './tree'

export default async function make(take: MakeTakeCast) {
  // const call = await make_call(take)
  // const load = await make_load(take)
  // const form = await make_form(take)
  const tree = await make_tree(take)

  // return { call, load, form, tree }
  return { tree }
}
