import { BaseCast } from '~/code/cast/base'
import hookForm from './form'
import hookLoad from './load'
import loveCode from '@wavebond/love-code'

export default async function hook({ base }: { base: BaseCast }) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
  list.push(
    `import { site } from '@wavebond/call/host/code/form/tree/site'`,
  )
  list.push(
    `import { List, list } from '@wavebond/call/host/code/form/tree/list'`,
  )
  list.push(...hookForm({ base }))
  list.push(...hookLoad({ base }))

  const text = await loveCode(list.join('\n'))
  return text
}
