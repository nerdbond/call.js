```ts
{
  link: 'chat',
  load: {
    code: {
      load: {
        base: true
      }
    },
    flow: {
      size: true,
      link: 'flow',
      find: [
        {
          base: ['chat', 'code', 'hook'],
          test: '=',
          head: ['flow', 'code', 'hook']
        }
      ],
      load: {
        code: {
          load: {
            base: true
          }
        }
      }
    }
  }
}
```

Querying multiple records with named nodes.

```ts
{
  hook: {
    chat: {
      name: {
        tibetan: {
          find: ...,
        },
        latin: {
          find: ...,
        }
      }
    },
    chat_text: {

    }
  }
}

{
  hook: {
    make_chat: {
      take: {
        code: {
          take: {
            base: 'suid'
          }
        }
      },
      load: {

      }
    },
    make_chat_text: {
      take: {
        code: {
          take: {
            base: 'suid'
          }
        }
      },
      load: {

      }
    },
    load_chat: {
      name: {
        tibetan: {
          find: ...,
        },
        latin: {
          find: ...,
        }
      }
    },
    load_chat_text: {

    }
  }
}
```

The `have` tells you what you can hook into.

```ts
const load = {
  ...chat,
}

type LoadNameCast = keyof typeof load

type RuleTaskFormCast = RuleCast<LoadNameCast>

const rule_make_chat: RuleTaskFormCast = {
  take: {
    code: {
      take: {
        base: 'suid',
      },
    },
  },
  back: 'chat',
  load: 'load_chat_base',
}

const rule_load_chat_by_code_base = {
  take: {
    code: {
      take: {
        base: 'suid',
      },
    },
  },
  back: 'chat',
  load: {
    flow: {
      size: true,
      take: {
        find: {
          // like: 'case', // or
          case: [
            {
              list: true,
              like: 'find_flow',
            },
            {
              like: 'find_flow',
            },
          ],
        },
      },
    },
  },
}

const find_flow = {
  case: [
    {
      like: 'find_flow_text_size',
    },
    {
      like: 'find_flow_text',
    },
  ],
}

const find_flow_text_size = {
  link: {
    link: { bind: 'text_size' },
    test: { like: 'string', take: ['>=', '>', '<=', '<', '=', '!='] },
    bond: { like: 'integer' },
  },
}

const find_flow_text = {
  link: {
    link: { bind: 'text' },
    test: { like: 'string', take: ['=', '!='] },
    bond: { like: 'string' },
  },
}

const load_chat_by_code_base = {
  take: {
    code: {
      base: '123',
    },
  },
  load: {
    flow: {
      size: true,
      take: {
        find: {
          link: 'text_size',
          test: '>=',
          bond: 3,
        },
      },
      load: {},
    },
  },
}

const rule = {
  make_chat,
  load_chat,
  load_chat_text,
}
```
