import { BaseType } from '~/code/type/base'
import handleType from './type'
import handleParser from './parser'
import loveCode from '@nerdbond/love-code'

export default async function handle({ base }: { base: BaseType }) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
  list.push(
    `import { record } from '@nerdbond/call/host/code/type/tree/mixin/record'`,
  )
  list.push(
    `import { Paginated, paginated } from '@nerdbond/call/host/code/type/tree/mixin/paginated'`,
  )
  list.push(...handleType({ base }))
  list.push(...handleParser({ base }))

  const text = await loveCode(list.join('\n'))
  return text
}
