import { MakeTakeCast } from '~/make/cast'

const take: MakeTakeCast = {
  file: '~/test/seed/take',
  mesh: {
    chat: {
      code: [['code', 'base']],
      link: {
        code: {
          link: {
            base: { like: 'seed_code', size: 32 },
            seed: { like: 'string' },
            hook: { like: 'string' },
          },
        },
        bool: { like: 'boolean' },
        date: { like: 'timestamp' },
        integer: { like: 'integer' },
        decimal: { like: 'decimal' },
        flow: { like: 'flow', list: true },
      },
    },
    flow: {
      code: [['code', 'base']],
      link: {
        code: {
          link: {
            base: { like: 'seed_code', size: 32 },
            seed: { like: 'string' },
            hook: { like: 'string' },
          },
        },
      },
    },
  },
  form: {
    seed_code: {
      like: 'string',
      test: (bond: string) => !!bond.match(/[mnk]/),
    },
    find_chat_by_code_base_exact: {
      link: {
        link: { bind: ['code', 'base'] },
        test: { like: 'string', take: ['=', '!='] },
        bond: { like: 'seed_code' },
      },
    },
  },
  rule: {
    task: {},
    load: {
      load_chat: {
        back: 'chat',
        load: {
          code: {
            load: {
              base: true,
              seed: true,
              hook: true,
            },
          },
        },
      },
    },
  },
  call: {
    task: {},
    load: {},
  },
}

export default take
