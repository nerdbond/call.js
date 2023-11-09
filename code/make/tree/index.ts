import { BaseCast } from '~/code/form/base'
import handleType from './type'
import handleParser from './parser'
import loveCode from '@wavebond/love-code'

export default async function handle({ base }: { base: BaseCast }) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
  list.push(
    `import { record } from '@wavebond/call/host/code/type/tree/mixin/record'`,
  )
  list.push(
    `import { Paginated, paginated } from '@wavebond/call/host/code/type/tree/mixin/paginated'`,
  )
  list.push(...handleType({ base }))
  list.push(...handleParser({ base }))

  const text = await loveCode(list.join('\n'))
  return text
}
