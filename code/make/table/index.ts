import { BaseCast } from '~/code/form/base'
import hookForm from './form'
import hookLoad from './load'

export default async function hook({ base }: { base: BaseCast }) {
  const form = await hookForm({ base })
  const load = await hookLoad({ base })

  return { form, load }
}
