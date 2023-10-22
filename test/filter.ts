import { z } from 'zod'
import * as Filter from '~/code/type/query/filter'

const TestFilter = Filter.FilterQuery([
  Filter.FilterString(['foo', 'bar']),
  Filter.FilterString(['hello', 'world']),
  Filter.FilterNumber(['baz']),
])
type TestFilterType = z.infer<typeof TestFilter>

const filter: TestFilterType = TestFilter.parse({
  type: 'test',
  path: ['foo', 'bar'],
  test: '=',
  value: 'hello',
})

console.log(
  TestFilter.parse({
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
  TestFilter.parse({
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
