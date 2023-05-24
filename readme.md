# call.js

This library depends on [form.js](https://github.com/tunebond/form.js).

```
yarn add @tunebond/call.js
```

## How it works

First, you specify a "query" (a `call`), which is basically a payload of
JSON (a "load"). This can have keys of `read` (for select/projections),
`save` for effects/updates, `find` for filtering, and `task` for the
action. The action can be any of these:

- `link`: connect
- `free`: disconnect
- `read`: select
- `kill`: remove
- `diff`: update
- `make`: create
- `test`: verify
- `save`: upsert

## Specification Examples

Here you specify your allowed read depth and allowed save structure.

The `read` needs to be defined separately from the rest of the call, so
we can generate a type from it. The response will then be of this type.

```ts
// base/call/read.ts
const read = {
  user: {
    size: true,
    list: {
      read: {
        id: true,
        name: true,
        email: true,
        posts: {
          read: {
            size: true,
            list: {
              read: {
                title: true,
                // notice, no author, can't get the user.posts.author
              },
            },
          },
        },
      },
    },
  },
  post: {
    size: true,
    list: {
      read: {
        title: true,
        author: {
          read: {
            id: true,
            name: true,
            email: true,
            posts: {
              read: {
                size: true,
              },
            },
          },
        },
      },
    },
  },
}

export default call
```

```ts
// base/call/make.ts
const make = {
  user: {
    save: {
      name: true,
      email: true,
    },
  },
}

export default make
```

## Queries

Then you can make your actual queries (loads). Each query gets a
corresponding zod type generated for it, so the object gets typed as it.

```ts
// read.ts
export const readUser1 = {
  read: {
    user: {
      read: {
        id: true,
        name: true,
        email: true,
        posts: {
          list: true,
          read: {
            size: true,
          },
        },
      },
    },
  },
}

const Read = {
  readUser1,
}

export default Read
```

```ts
// call.ts
import { readUser1 } from './read.js'

export const findUserById = ({ id }) =>
  _.merge(readUser1, {
    read: {
      user: {
        find: {
          form: 'like',
          base: 'name',
          test: 'bond',
          head: id,
        },
      },
    },
  })

const Call = {
  findUserById: {
    read: readUser1,
    load: findUserById,
  },
}

export default Call
```

From these two definitions, we can generate the appropriate types.

```ts
import call from './call.js'

async function handle() {
  const result = await call('findByUserId', { id: '123' })
}
```
