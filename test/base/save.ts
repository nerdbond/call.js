const SaveBase = {
  saveVote: {
    link: {
      value: {
        form: 'mark',
      },
      object: {
        link: {
          form: {
            form: 'text',
          },
          code: {
            form: 'code',
          },
        },
      },
    },
    read: { form: 'vote' },
  },

  makeUser: {
    link: {
      email: {
        form: 'text',
      },
      slug: {
        form: 'text',
      },
    },
    read: { form: 'user' },
  },
}

export default SaveBase
