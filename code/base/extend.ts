import _ from 'lodash'
import { ComparisonOperatorExpression } from 'kysely'
import { SchemaPropertyContainerType, ExtendQueryType } from '../form'
import { Adapter } from './adapter'
import { transformTableToTree } from './table'

export function transformExtendToTable(
  adapter: Adapter,
  name: string,
  extend: ExtendQueryType,
) {
  const schema = adapter.base[name]

  return transformExtendObject(schema, extend)
}

function transformExtendObject(
  schema: SchemaPropertyContainerType,
  extend: ExtendQueryType,
  path: Array<string> = [],
  self: Array<string> = [],
  child: Record<string, ExtendQueryType> = {},
): [Array<string>, Record<string, ExtendQueryType>] {
  for (const name in extend) {
    const value = extend[name]

    if (value === true) {
      self.push(path.concat([name]).join('__'))
    } else if (typeof value === 'object') {
      const property = schema.property?.[name]
      if (property) {
        switch (property.type) {
          case 'object':
            transformExtendObject(
              property,
              value,
              path.concat([name]),
              self,
              child,
            )
            break
          case 'record':
            console.log(`TODO: 'record' type`)
            break
          default:
            child[name] = value
            break
        }
      }
    }
  }

  return [self, child]
}

export async function queryAndExtendRecord({
  adapter,
  name,
  condition,
  extend,
}: {
  adapter: Adapter
  name: string
  condition: Array<[string, ComparisonOperatorExpression, any]>
  extend: ExtendQueryType
}) {
  const schema = adapter.base[name]
  let query = adapter.db.selectFrom(name).select([schema.primary])

  condition.forEach(c => {
    query = query.where(c[0], c[1], c[2])
  })

  const basicRecord = await query.executeTakeFirstOrThrow()

  const record = await extendRecord({
    adapter,
    name,
    key: basicRecord[schema.primary],
    extend: extend,
  })

  return record
}

export async function queryAndExtendCollection({
  adapter,
  name,
  condition,
  extend,
}: {
  adapter: Adapter
  name: string
  condition: Array<[string, ComparisonOperatorExpression, any]>
  extend: ExtendQueryType
}) {
  const schema = adapter.base[name]
  let query = adapter.db.selectFrom(name).select([schema.primary])

  condition.forEach(c => {
    query = query.where(c[0], c[1], c[2])
  })

  const list = await query.execute()

  const { total } = await adapter.db
    .selectFrom(name)
    .select(adapter.db.fn.count<number>(schema.primary).as('total'))
    .executeTakeFirstOrThrow()

  const record = await extendCollection({
    adapter,
    name,
    key: list.map(x => x[schema.primary]),
    extend: extend,
  })

  return { total, record }
}

export async function extendCollection({
  adapter,
  name,
  key,
  extend,
}: {
  adapter: Adapter
  name: string
  key: Array<string>
  extend: ExtendQueryType
}) {
  const schema = adapter.base[name]

  const [self, child] = transformExtendToTable(adapter, name, extend)

  let list: Array<object> = []

  if (self.length) {
    const tableMapList = await adapter.db
      .selectFrom(name)
      .where(schema.primary, 'in', key)
      .select(self)
      .execute()

    const treeMapList = tableMapList.map(tableMap =>
      transformTableToTree(tableMap),
    )

    list = treeMapList
  } else {
    list = key.map(value => ({ [schema.primary]: value }))
  }

  for (const name in child) {
    const property = schema.property[name]

    if (property) {
      const childExtend = child[name]
      if (property.list) {
        // const childRecordList = adapter.model[name].extend({
        //   filter: {
        //     [property.self]: {
        //       id,
        //     },
        //   },
        //   extend: childExtend,
        // })
      } else {
        // const childRecord = adapter.model[name].extend(id, childExtend)
      }
    }
  }

  return list
}

export async function extendRecord({
  name,
  key,
  extend,
  adapter,
}: {
  adapter: Adapter
  name: string
  key: string
  extend: ExtendQueryType
}) {
  const schema = adapter.base[name]

  const [self, child] = transformExtendToTable(adapter, name, extend)

  const record: Record<string, any> = {}

  if (self.length) {
    const tableMap = await adapter.db
      .selectFrom(name)
      .where(schema.primary, '=', key)
      .select(self)
      .executeTakeFirstOrThrow()

    const treeMap = transformTableToTree(tableMap)

    _.merge(record, treeMap)
  } else {
    record[schema.primary] = key
  }

  for (const name in child) {
    const property = schema.property[name]

    if (property) {
      const childExtend = child[name]
      if (property.list) {
        // const childRecordList = adapter.model[name].expandGather({
        //   filter: {
        //     [property.self]: {
        //       id,
        //     },
        //   },
        //   extend: childExtend,
        // })
      } else {
        // const childRecord = adapter.model[name].expandSelect(
        //   id,
        //   childExtend,
        // )
      }
    }
  }
}
