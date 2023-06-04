import { ReadTakeBase } from '~/base/index.js'

const ReadTakeBase = {
  post: {
    read: {
      list: {
        read: {
          author: {
            read: {
              email: true,
              id: true,
              name: true,
              posts: {
                read: {
                  size: true,
                },
              },
            },
          },
          title: true,
        },
      },
      size: true,
    },
  },
  user: {
    read: {
      list: {
        read: {
          email: true,
          id: true,
          name: true,
          slug: true,
          posts: {
            read: {
              list: {
                read: {
                  author: {
                    read: {
                      id: true,
                    },
                  },
                  id: true,
                  title: true,
                },
              },
              size: true,
            },
          },
        },
      },
      size: true,
    },
  },
  vote: {
    read: {
      size: true,
      list: {
        read: {
          value: true,
          object: {
            name: {
              user: {
                read: {
                  id: true,
                },
              },
              post: {
                read: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  },
} satisfies ReadTakeBase

export default ReadTakeBase
