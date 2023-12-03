import { BaseCast } from '~/code/cast/mesh'
import hookForm from './cast'
import hookLoad from './take'
import { CallHaulMeshCast } from '~/code/cast/call'

export default async function hook({
  base,
  call,
}: {
  base: BaseCast
  call: CallHaulMeshCast
}) {
  const form = await hookForm({ base, call })
  const load = await hookLoad({ base, call })

  return { form, load }
}
