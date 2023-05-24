import { AnyColumn, ComparisonOperatorExpression, InsertObject, JoinReferenceExpression, Kysely, OperandValueExpressionOrList, OrderByDirectionExpression, OrderByExpression, ReferenceExpression, Selection, SimpleReferenceExpression , Kysely, PostgresDialect } from 'kysely';
import { ExtractTableAlias, TableExpression } from 'kysely/dist/cjs/parser/table-parser';
import { Pool } from 'pg'
// or `import * as Cursor from 'pg-cursor'` depending on your tsconfig
import Cursor from 'pg-cursor'

export type BaseName<T> = keyof OmitIndexSignature<T> & string

export type FormBond<
  B extends DB,
  N extends BaseName<B>,
> = OperandValueExpressionOrList<
  B,
  ExtractTableAlias<B, N>,
  FormName<B, N>
>

export type FormLink<
  B extends DB,
  N extends BaseName<B>,
> = JoinReferenceExpression<B, ExtractTableAlias<B, N>, string>

export type FormName<
  B extends DB,
  N extends BaseName<B>,
> = AnyColumn<B, ExtractTableAlias<B, N>>

export type Link = {
  base: LinkBond
  head: LinkBond
}

export type LinkBond = {
  form: string
  name: string
}

export type OmitIndexSignature<ObjectType> = {
  [KeyType in keyof ObjectType as {} extends Record<KeyType, unknown>
    ? never
    : KeyType]: ObjectType[KeyType]
}

type DB = {
  post: { authorId: string }
  user: { id: string, name: string }
}

const db: Kysely<DB> = new Kysely<DB>({
  dialect: new PostgresDialect({
    cursor: Cursor,
    pool: new Pool({
      database: 'kysely_test',
      host: 'localhost',
    }),
  }),
})

db.selectFrom('user').innerJoin('post', 'user.id', 'post.authorId')

const query = JSON.parse(JSON.stringify({ l: { prop: 'id', type: 'user' }, r: { prop: 'authorId', type: 'post' } })) as Record<string, unknown>

assertRecord(query.l)
assertString(query.l.type)
assertName<DB, 'user'>(query.l.type)
assertBond<DB, 'user'>(query.l.type as 'user', query.l.prop)

db.selectFrom('user').innerJoin('post', `${query.l.type}.${query.l.prop}`, `${query.r?.type}.${query.r?.prop}`)

function assertRecord(name: unknown): asserts name is Record<string, unknown> {
  if (!name || typeof name !== 'object') {
    throw new Error
  }
}

function assertString(name: unknown): asserts name is string {
  if (typeof name !== 'string') {
    throw new Error
  }
}

function assertName<B extends DB, N extends BaseName<B>>(name: string): asserts name is N {
  if (!name) {
    throw new Error
  }
}

function assertBond<B extends DB, N extends BaseName<B>>(form: N, name: unknown): asserts name is FormBond<B, N> {
  if (!name) {
    throw new Error
  }
}

export async function makeReadList<
  B extends DB,
  N extends BaseName<B>,
>(base: B) {
  const linkMesh: Record<string, Link> = {}

  for (const linkName in linkMesh) {
    const link = linkMesh[linkName]
    assertRecord(link)

    assertName(link.head.form)
    assertBond(link.head.form, link.head.name)
    assertRecord(query.l)
    assertString(query.l.type)
    // assertName<DB, 'user'>(query.l.type)
    // innerJoin<
    //   TableExpression<DB, 'user'>,
    //   JoinReferenceExpression<
    //     B,
    //     ExtractTableAlias<B, N>,
    //     FormName<B, N>
    //   >,
    //   JoinReferenceExpression<B, N, FormName<B, N>>
    // >
    const call = db.selectFrom(query.l.type).innerJoin(
      link.head.form,
      `${link.head.form}.${link.head.name}`,
      `${link.base.form}.${link.base.name}`,
    )
  }
}
