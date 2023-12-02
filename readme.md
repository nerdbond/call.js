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
export const ChatWithCodeBase = {
  name: true,
  code: {
    load: {
      base: true
    }
  }
}

export const load = {
  ChatWithCodeBase
}

const readChatWithCodeBase = {
  host: 'wavebond',
  deck: 'seed',
  task: 'readWithCodeBase',
  form: 'chat',
  code: '12321', // secret token.
  word: 'key to unlock these actions',
  base: {
    find: {
      form: 'or',
      test: []
    },
    load: 'ChatWithCodeBase',
  }
}

// this defines what is acceptable.
readChatCodeBase
call_have {
  seek: {
    code: {
      link: {
        base: { like: 'suid' }
      }
    }
  },
  load: {
    code: {
      load: {
        base: true
      }
    }
  }
}

{
  seek: {
    code: {
      link: {
        hook: { like: 'suid' },
      }
    }
  }
}

seed.link({
  wavebond: {
    seed: {
      chat: {
        readChatByCodeBase
      }
    },
    [`hood:${process.env.HOOD}`]: {
      chat: {
        saveChatWithCodeSeed
      }
    }
  }
})

import CallBase from '~/calls'

const call = new CallBase

call.form({
  name: 'ChatWithCodeBase',
  load: {
    name: true,
    code: {
      load: {
        base: true
      }
    }
  }
})

call.bind('readChatWithCodeBase1', {
  host: 'wavebond',
  deck: 'seed',
  task: 'readChatWithCodeBase',
  form: 'ChatWithCodeBase',
  code: '12321', // secret token.
  word: 'key to unlock these actions'
})

call.make('readChatWithCodeBase1', {
  find: {
    form: 'or',
    test: []
  },
}) as Call.ChatWithCodeBaseCast


async function call(haul) {
  const host = base[haul.host]
  const deck = host?.[haul.deck]
  const word = deck?.[haul.word]
  const form = word?.[haul.form]
  const task = form?.[haul.task]
  const back = await task?.(haul)
}

// form.ts
export const ChatWithCodeBase = {
  name: true,
  code: {
    load: {
      base: true
    }
  }
}

call.form('ChatWithCodeBase', ChatWithCodeBase)

// task.ts
export const readChatWithCodeBase1 = {
  host: 'wavebond',
  deck: 'seed',
  call: 'readChatWithCodeBase',
  load: 'ChatWithCodeBase',
  code: '12321', // secret token.
  word: 'key to unlock these actions'
}

call.task('readChatWithCodeBase1', readChatWithCodeBase1)
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
