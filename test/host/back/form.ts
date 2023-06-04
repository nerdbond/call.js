/* eslint-disable @typescript-eslint/no-namespace */
export namespace Form {
  export type Post = {
    authorId: Code
    content: string
    createdAt: string
    id: Code
    title: string
  }

  export type User = {
    email?: string | null | undefined
    id: Code
    name: string
  }
}

export type Base = {
  post: Form.Post
  user: Form.User
}

export type Name = keyof Base
