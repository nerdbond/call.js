import { z } from 'zod'
import * as Find from '~/code/cast/call/find'

const TestFind = Find.FindCall([
  Find.FindString(['foo', 'bar']),
  Find.FindString(['hello', 'world']),
  Find.FindNumber(['baz']),
])

type TestFindType = z.infer<typeof TestFind>

const filter: TestFindType = TestFind.parse({
  type: 'test',
  path: ['foo', 'bar'],
  test: '=',
  value: 'hello',
})

console.log(
  TestFind.parse({
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
  TestFind.parse({
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
