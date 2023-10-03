<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<h3 align='center'>@nerdbond/call</h3>
<p align='center'>
  GraphQL-like query resolver for TypeScript
</p>

<br/>
<br/>
<br/>

## Installation

```
pnpm add @nerdbond/call
yarn add @nerdbond/call
npm i @nerdbond/call
```

This library depends on the
[`@nerdbond/form`](https://github.com/nerdbond/form.js) model
definitions.

## How it works

1. **`call`**: A `call` is a query.
1. **`load`**: A `load` is a query payload.
1. **`task`**: A `task` is a query action.
1. **`read`**: A `read` is a query projection.
1. **`find`**: A `find` is a query filter.
1. **`save`**: A `save` is a query mutation.

Each one of these has types defined in the main TypeScript file.

### The `load`

The `load` for a `call` might look like this:

```js
{
  task: 'read',
  read: {
    user: {
      find: {
        form: 'like',
        base: { link: 'name' },
        test: 'bond',
        head: 'Jane Doe',
      },
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
```

### The `task`

A `task` is a query action, and can take any of these forms.

- `link`: attach (connect)
- `toss`: detach (disconnect)
- `read`: select
- `kill`: remove
- `diff`: update
- `make`: create
- `test`: verify
- `save`: upsert

### The `read`

There are two aspects to the `read`:

1. The allowed read depth.
2. Each read query.

The allowed read depth says how far any query is allowed to go for each
model.

```ts
// base/take/read.ts
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
                list: true,
                read: {
                  size: true,
                },
              },
            },
          },
        },
      },
    },
  },
}

export default read
```

This read "take" or "what is allowed to be read" is transformed into a
tree schema so we can quickly check the data that comes in in a query
and see if it is valid.

Then you have your specific read queries, which are part of a call, as
illustrated earlier.

### The `find`

The find is a filtering function, which can be an array or an object. It
includes `and` and `or` functionality, albeit with a custom language.

There are 3 kinds of conditions:

- `like`: A basic comparison, using one of the conditions defined next.
- `roll`: An `or` comparison.
- `bind`: An `and` comparison.

These are the kinds of `like` conditions:

| like             | meaning                             |
| :--------------- | :---------------------------------- |
| `bond`           | equals                              |
| `base_mark`      | greater than                        |
| `base_link_mark` | greater than or equal to            |
| `head_mark`      | less than                           |
| `head_link_mark` | less than or equal to               |
| `miss_bond`      | not equal                           |
| `have_bond`      | `in` in SQL (list contains an item) |
| `have_text`      | text `contains` a substring         |

So for example, you can do this to
`find a user where name is "Jane Doe" or "John Doe"`:

```
{
  task: 'read',
  read: {
    user: {
      find: {
        form: 'roll',
        list: [
          {
            form: 'like',
            base: { link: 'name' },
            test: 'bond',
            head: 'Jane Doe',
          },
          {
            form: 'like',
            base: { link: 'name' },
            test: 'bond',
            head: 'John Doe',
          }
        ]
      },
      read: {
        id: true,
        name: true,
      },
    },
  },
}
```

### The `save`

Like the `read`, there is a set of things you can change through the
`save`:

```ts
// base/take/save.ts
const save = {
  user: {
    save: {
      name: true,
      email: true,
    },
  },
}

export default save
```

Then there is the `save` part of the load.

## Example

First, define each `read`, which will be converted into types.

```ts
// read.ts
export const readUser1 = {
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
}

const Read = {
  readUser1,
}

export default Read
```

Next, define each `call`, which uses each `read`.

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

From these two definitions, we can generate the appropriate types. The
read constructs a zod type, using the form definitions on what it
accepts and validations and such.

```ts
import fs from 'fs'

import { make } from '@nerdbond/call.js/make'

import Base from './base'
import Call from './call'

const { form, call } = make(Call, Base)

fs.writeFileSync(`gen/call.ts`, call)
fs.writeFileSync(`gen/form.ts`, form)
```

That should generate the code for you:

```ts
import call from './gen/call.js'

async function handle() {
  const result = await call('findByUserId', { id: '123' })
}
```

## Development

```
yarn test:make
yarn test
```

Those are the testing commands.

## License

MIT

## NerdBond

This is being developed by the folks at [NerdBond](https://nerd.bond), a
California-based project for helping humanity master information and
computation. NerdBond started off in the winter of 2008 as a spark of an
idea, to forming a company 10 years later in the winter of 2018, to a
seed of a project just beginning its development phases. It is entirely
bootstrapped by working full time and running
[Etsy](https://etsy.com/shop/nerdbond) and
[Amazon](https://www.amazon.com/s?rh=p_27%3AMount+Build) shops. Also
find us on [Facebook](https://www.facebook.com/nerdbond),
[Twitter](https://twitter.com/nerdbond), and
[LinkedIn](https://www.linkedin.com/company/nerdbond). Check out our
other GitHub projects as well!
