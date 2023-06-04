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

export const readVote = {
  value: true,
  object: {
    name: {
      post: {
        read: {
          id: true,
        },
      },
      comment: {
        read: {
          id: true,
        },
      },
    },
  },
}

export const readUser1 = {
  user: {
    read: {
      email: true,
      id: true,
      name: true,
      slug: true,
      ...userPosts,
    },
  },
}

export const readUserBasic = {
  id: true,
  email: true,
  slug: true,
  createdAt: true,
}
