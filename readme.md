<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/wavebond/call.js/blob/make/view/base.gif?raw=true' height='192'>
</p>

<h3 align='center'>@wavebond/work</h3>
<p align='center'>
  GraphQL-like query resolver for TypeScript
</p>

<br/>
<br/>
<br/>

## Installation

```
pnpm add @wavebond/work
yarn add @wavebond/work
npm i @wavebond/work
```

## Example

First you have to define the "haves", which are the rules defining what
is allowed in a call. First we define the "load haves", the properties
which you are allowed to query. This is a static definition used to
generate type definitions.

```ts
// ~/works/base/rule/load/chat.ts
export const load_chat_base: RuleLoadCast = {
  back: 'chat',
  load: {
    code: {
      load: {
        base: true,
        seed: true,
        hook: true,
      },
    },
    flow: {
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
}
```

Then we aggregate all the load haves into one object with names as the
keys.

```ts
// ~/works/base/rule/load/index.ts
import * as chat from './chat'

const load = {
  ...chat,
}

export default load
```

Then given we have all the load rules defined, we can create a type for
the list of have load names.

```ts
// ~/works/base/cast/rule/load.ts
import load from '~/works/base/rule/load'

export type RuleLoadNameCast = keyof typeof load
```

Given those have load names, we can create a type used by the "have
tasks", or the task creation rules.

```ts
// ~/works/base/cast/rule/task.ts
import { RuleLoadNameCast } from '~/works/base/cast/rule/load'
import { RuleTaskCast } from '@wavebond/work'

export type RuleTaskFormCast = RuleTaskCast<RuleLoadNameCast>
```

So now we have a `RuleTaskFormCast` type, and this is used to type our
definition of have tasks, so we can get autocompletion for the load
names. These are also static definitions, so don't have any dynamic
parameters, because they are used to create compile-time type
definitions.

```ts
// ~/works/base/rule/task/chat.ts
export const read_chat_by_code_hook: RuleTaskFormCast = {
  take: {
    code: {
      link: {
        hook: { like: 'string' },
      },
    },
  },
  load: 'load_chat_base',
}
```

Given a bunch of rule task definitions, for the definition of possible
tasks, we aggregate them as well.

```ts
// ~/works/base/rule/task/index.ts
import * as chat from './chat'

const task = {
  ...chat,
}

export default task
```

Now we are done with the "have" types, the specs on what types of calls
can be created.

We move on to creating "call" types, starting with the load call types.
These define our specific query structure, given the limitations of the
corresponding have load type.

```ts
// ~/works/base/call/load/chat.ts
export const load_chat_base = {
  back: 'chat',
  load: {
    code: {
      load: {
        base: true,
        hook: true,
        seed: true,
      },
    },
    flow: {
      load: {
        code: {
          load: {
            base: true,
            hook: true,
            seed: true,
          },
        },
      },
    },
  },
}
```

Then like usual, we aggregate all our call load type definitions.

```ts
// ~/works/base/call/load/index.ts
import * as chat from './chat'

const load = {
  ...chat,
}

export default load
```

And we can collect the names for all the call load types.

```ts
// ~/works/base/cast/call/load.ts
import load from '~/works/base/call/load'

export type CallLoadNameCast = keyof typeof load
```

Given the load names, we can create a `HookFormCast` type which will be
used to get autocomplete on (a) the have task names, and (b) the call
load names.

```ts
// ~/works/base/cast/call/task.ts
import task from '~/works/base/have/task'
import { CallLoadNameCast } from '~/works/base/cast/call/load'

export type RuleTaskNameCast = keyof typeof task

export type HookFormCast = HookCast<RuleTaskNameCast, CallLoadNameCast>
```

Given the `HookFormCast`, we can create specific task structures which
we will use to make API calls at runtime. This takes a reference to a
have task name, and a call load name.

```ts
// ~/works/base/call/task/chat.ts
import { HookFormCast } from '~/works/base/cast/call/task'

export const read_chat_by_code_hook: HookFormCast = {
  host: 'foo',
  deck: 'bar',
  // this `task` is referencing a task
  // defined in the @wavebond/seed project.
  task: 'read_chat_by_code_hook',
  // this `load` is referencing a type
  // we just defined for our load forms.
  load: 'load_chat_base',
}
```

Then we aggregate them like usual.

```ts
// ~/works/base/call/task/index.ts
import * as chat from './chat'

const task = {
  ...chat,
}

export default task
```

```ts
// ~/works/base/rule/index.ts
import task from './task'
import load from './load'

export default { task, load }
```

```ts
// ~/works/base/call/index.ts
import task from './task'
import load from './load'

export default { task, load }
```

Now we build our script to generate the call files and their types. The
`./form` are the schema definitions.

```ts
// ./scripts/work/make.ts
import makeWork from '@wavebond/work/make'
import baseForm from '~/calls/base/form'
import baseRule from '~/calls/base/rule'
import baseCall from '~/calls/base/call'
import fs from 'fs'

async function make() {
  const { load, task, form } = await makeWork({
    form: baseForm,
    have: baseRule,
    call: baseCall,
  })
  fs.writeFileSync('~/works/load.ts', load)
  fs.writeFileSync('~/works/task.ts', task)
  fs.writeFileSync('~/works/form.ts', form)
}
```

Then here, the `test` function makes a call to a `host` with the
payload.

```ts
import Work from '@wavebond/work'
import Load from '~/calls/load'
import Task from '~/calls/task'
import { LoadChatBaseCast } from '~/calls/form'

const work = new Work({
  host: 'http://localhost:3000',
  // set auth token where work POSTs to.
  code: process.env.WORK_CODE
  // load the generated types for making calls.
  load: Load,
  task: Task,
})

async function test() {
  const back = await work.call<LoadChatBaseCast>('read_chat_by_code_hook', {
    take: {
      find: {
        form: 'test',
        link: ['code', 'hook'],
        test: '=',
        bond: 'tibetan',
      },
    },
    load: {
      flow: {
        take: {
          curb: 1000,
          sort: [
            {
              link: ['code', 'hook'],
              bond: 'fall',
            }
          ]
        },
        load: {
          code: {
            load: {
              hook: true
            }
          }
        }
      }
    }
  })

  console.log(back)
  // {
  //   form: 'call_back',
  //   code: {
  //     mark: 'rise', // it's a good response
  //     call: 200
  //   },
  //   load: {
  //     form: 'chat',
  //     code: {
  //       base: '129381983918',
  //       hook: 'tibetan',
  //       seed: 'mbdzkv'
  //     },
  //     flow: {
  //       size: 296,
  //       load: [
  //         {
  //           code: {
  //             base: '329391982911',
  //             hook: 'foo',
  //             seed: 'mbfztn'
  //           }
  //         },
  //         // ...
  //       ]
  //     }
  //   }
  // }

  const back = await work.call<LoadChatBaseCast>('read_chat_by_code_hook', {
    take: {
      find: {
        form: 'test',
        link: ['code', 'hook'],
        bond: 'oops',
      }
    },
  })

  console.log(back)
  // {
  //   form: 'call_back',
  //   code: {
  //     mark: 'fall', // it's a bad response
  //     call: 404
  //   },
  // }
}
```

Under the hood, this will make a `POST` request to the `host` with this
JSON body:

```ts
{
  form: 'call',
  task: 'read_chat_by_code_hook',
  host: 'foo',
  deck: 'bar',
  code: '12321',
  take: {
    find: {
      form: 'test',
      link: ['code', 'hook'],
      test: '=',
      bond: 'tibetan',
    },
  },
  load: {
    code: {
      load: {
        base: true,
        hook: true,
        seed: true,
      },
    },
    flow: {
      take: {
        curb: 1000,
        sort: [
          {
            link: ['code', 'hook'],
            bond: 'fall',
          }
        ],
      },
      load: {
        code: {
          load: {
            base: true,
            hook: true,
            seed: true,
          },
        },
      },
    }
  }
}
```

Then you will need to implement a handler for this call in the host/deck
namespace.

```ts
import {
  ReadChatByCodeHookCallTake,
  ReadChatByCodeHookCallCast,
} from '~/works/form'

export const readChatByCodeHook = (
  call: ReadChatByCodeHookCallCast,
) => {
  const callHead = ReadChatByCodeHookCallTake.parse(call)
  // do SQL stuff on these parsed inputs.
  const back = {}
  return back
}
```

We have a base tool to perform CRUD operations on each record type.

```ts
import { ReadChatCallCast, ReadChatCallTake } from '~/works/form'
import mesh from '~/bindings/mesh'

export const readChatByCodeHook = async (
  call: Cast.ReadChatByCodeHookCall,
) => {
  const callHead = Take.ReadChatByCodeHookCall.parse(call)
  // do SQL stuff on these parsed inputs.
  const back = await mesh.read(callHead)
  return back
}
```

Perhaps the `mesh` looks like this:

```ts
const base = {
  chat,
  flow,
}

export default new Mesh(base)
```

```ts
export const read = (mesh, call) => {}

export const make = (mesh, call) => {}
```

## License

MIT

## WaveBond

This is being developed by the folks at [WaveBond](https://wave.bond), a
California-based project for helping humanity master information and
computation. WaveBond started off in the winter of 2008 as a spark of an
idea, to forming a company 10 years later in the winter of 2018, to a
seed of a project just beginning its development phases. It is entirely
bootstrapped by working full time and running
[Etsy](https://etsy.com/shop/wavebond) and
[Amazon](https://www.amazon.com/s?rh=p_27%3AMount+Build) shops. Also
find us on [Facebook](https://www.facebook.com/wavebond),
[Twitter](https://twitter.com/_wavebond), and
[LinkedIn](https://www.linkedin.com/company/wavebond). Check out our
other GitHub projects as well!
