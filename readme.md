# call.js

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

Then you can make your actual queries (loads).

```ts
export const findUserById = () => ({
  read: {
    user: {
      find: {
        form: 'like',
        base: 'name',
        test: 'bond',
        head: 'dawn',
      },
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
})
```
