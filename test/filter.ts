import * as Filter from '~/code/type/query/filter'

const TestFilter = Filter.FilterQuery('string', ['foo', 'bar'])

console.log(
  TestFilter.parse({
    type: 'test',
    path: ['foo', 'bar'],
    test: '=',
    value: 'hello',
  }),
)

console.log(
  TestFilter.parse({
    type: 'and',
    condition: [
      {
        type: 'test',
        path: ['foo', 'bar'],
        test: '=',
        value: 'hello',
      },
    ],
  }),
)
