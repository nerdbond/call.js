import { ReadTakeBase } from '../../../base.js'

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
                list: true,
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
    list: true,
    read: {
      list: {
        read: {
          email: true,
          id: true,
          name: true,
          posts: {
            list: true,
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
} satisfies ReadTakeBase

export default ReadTakeBase
