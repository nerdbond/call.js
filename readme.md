# call.js

This library depends on [form.js](https://github.com/tunebond/form.js).

```
yarn add @tunebond/call.js
```

## Specification Examples

Here you specify your allowed read depth and allowed save structure.

```ts
// base/call/read.ts
const read = {
  user: {
    read: {
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
  },
  post: {
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
import { readUser1 } from './read.js'

// load.ts
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

const Load = {
  findUserById: {
    read: readUser1,
    call: findUserById,
  },
}

export default Load
```

From these two definitions, we can generate the appropriate types.
