import Kink from '@nerdbond/kink'

const host = '@nerdbond/call'

type BaseZodError = {
  path: Array<string | number>
  message: string
}

type Base = {
  request_timeout: {
    take: {
      url: string
    }
    // base: {
    //   url: string
    // }
    // fill: {
    //   url: string
    // }
  }
  request_unable: {
    take: {}
  }
  invalid_type: {
    take: BaseZodError & {
      expected: string
      received: string
    }
  }
  unrecognized_keys: {
    take: BaseZodError & {
      keys: Array<string>
    }
  }
}

type Name = keyof Base

Kink.code(host, (code: number) => code.toString(16).padStart(4, '0'))

Kink.base(
  host,
  'request_timeout',
  (take: Base['request_timeout']['take']) => ({
    code: 1,
    note: 'Request timeout',
    url: take.url,
  }),
)

Kink.base(
  host,
  'request_unable',
  (take: Base['request_unable']['take']) => ({
    code: 2,
    note: 'System unable to make request currently',
  }),
)

Kink.base(
  host,
  'invalid_type',
  (take: Base['invalid_type']['take']) => ({
    code: 3,
    note: 'Invalid property type',
    expected: take.expected,
    received: take.received,
    path: take.path,
    hint: take.message,
  }),
)

// https://github.com/colinhacks/zod/blob/master/ERROR_HANDLING.md
Kink.base(
  host,
  'unrecognized_keys',
  (take: Base['unrecognized_keys']['take']) => ({
    code: 4,
    note: 'Unrecognized keys in object',
    key: take.keys,
    path: take.path,
    hint: take.message,
  }),
)

export default function makeBase<N extends Name>(
  form: N,
  link?: Base[N]['take'],
) {
  return Kink.make(host, form, link)
}
