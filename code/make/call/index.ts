import { BaseCast } from '~/code/form/base'
import hookForm from './form'
import hookLoad from './load'
import { CallHaulMeshCast } from '~/code/form/call'

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
