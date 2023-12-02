import { BaseCast } from '~/code/cast/base'
import hookForm from './form'
import hookLoad from './load'
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
