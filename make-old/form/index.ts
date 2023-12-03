import { BaseCast } from '~/code/cast/mesh'
import hookForm from './cast'
import hookLoad from './take'

export default async function hook({ base }: { base: BaseCast }) {
  const form = await hookForm({ base })
  const load = await hookLoad({ base })

  return { form, load }
}
