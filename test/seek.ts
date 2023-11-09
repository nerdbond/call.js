import { z } from 'zod'
import * as Seek from '~/code/form/call/seek'

const TestSeek = Seek.SeekCall([
  Seek.SeekString(['foo', 'bar']),
  Seek.SeekString(['hello', 'world']),
  Seek.SeekNumber(['baz']),
])

type TestSeekType = z.infer<typeof TestSeek>

const filter: TestSeekType = TestSeek.parse({
  type: 'test',
  path: ['foo', 'bar'],
  test: '=',
  value: 'hello',
})

console.log(
  TestSeek.parse({
    type: 'and',
    condition: [
      {
        type: 'test',
        path: ['hello', 'world'],
        test: '=',
        value: 'hello',
      },
    ],
  }),
)

console.log(
  TestSeek.parse({
    type: 'or',
    condition: [
      {
        type: 'test',
        path: ['baz'],
        test: '>',
        value: 123,
      },
    ],
  }),
)
