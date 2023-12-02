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

```ts
// ./calls/base/load/chat.ts
export const ChatBase = {
  code: {
    load: {
      base: true,
      hook: true,
      seed: true,
    },
  },
  flow: {
    curb: 1000,
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
}
```

Next we collect all our uniquely named loads into an object keyed by
name.

```ts
// ./calls/base/load/index.ts
import * as chat from './chat'

const load = {
  ...chat,
}

export default load
```

```ts
// ./calls/base/cast/task.ts
import task from '~/calls/base/task'

export type TaskNameCast = keyof typeof task
```

And then we build some types from that, so we can type our tasks next.

```ts
// ./calls/base/cast/load.ts
import { TaskCast } from '@wavebond/work'
import { TaskNameCast } from '~/calls/base/cast/task'
import load from './load'

export type LoadNameCast = keyof typeof load

export type LoadTaskCast = TaskCast<TaskNameCast, FormNameCast>
```

Define some tasks, which have some type niceties.

```ts
// ./calls/base/task/chat.ts
import { LoadTaskCast } from '../cast/task'

export const readChatByCodeHook: LoadTaskCast = {
  host: 'foo',
  deck: 'bar',
  // this `call` is referencing a call
  // defined in the @wavebond/seed project.
  call: 'readChatByCodeHook',
  // this `load` is referencing a type
  // we just defined for our load forms.
  load: 'ChatBase',
}
```

```ts
// ./calls/base/task/index.ts
import * as chat from './chat'

const task = {
  ...chat,
}

export default task
```

Now we build our script to generate the call files and their types.

```ts
// ./scripts/work/make.ts
import makeWork from '@wavebond/work/make'
import baseForm from '~/calls/base/form'
import baseHave from '~/calls/base/have'
import baseLoad from '~/calls/base/load'
import baseTask from '~/calls/base/task'
import fs from 'fs'

async function make() {
  const { load, task, form } = await makeWork({
    form: baseForm,
    have: baseHave,
    load: baseLoad,
    task: baseTask,
  })
  fs.mkdirSync('./calls', { recursive: true })
  fs.writeFileSync('./calls/load.ts', load)
  fs.writeFileSync('./calls/task.ts', task)
  fs.writeFileSync('./calls/form.ts', form)
}
```

Then here, the `test` function makes a call to a `host` with the
payload.

```ts
import Work from '@wavebond/work'
import Load from '~/calls/load'
import Task from '~/calls/task'
import Form from '~/calls/form'

const work = new Work({
  host: 'http://localhost:3000',
  // set auth token for seed.surf
  code: process.env.SEED_CODE
  // load the generated types for making calls.
  load: Load,
  task: Task,
})

async function test() {
  const back = await work.call<Form.ChatBaseCast>('readChatByCodeHook', {
    find: {
      form: 'test',
      link: ['code', 'hook'],
      bond: 'tibetan',
    },
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

  const back = await work.call<Form.ChatBaseCast>('readChatByCodeHook', {
    find: {
      form: 'test',
      link: ['code', 'hook'],
      bond: 'oops',
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
