export const userPosts = {
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
}

export const readUser1 = {
  user: {
    read: {
      email: true,
      id: true,
      name: true,
      ...userPosts,
    },
  },
}
