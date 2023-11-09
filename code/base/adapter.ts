import {
  BaseType,
  ModelType,
  CreateQueryType,
  ExtendQueryType,
  RemoveQueryType,
  SelectQueryType,
  UpdateQueryType,
} from '../form'
import { Kysely } from 'kysely'

export type NameType = {
  name: string
}

export class Adapter {
  model: ModelType
  base: BaseType
  db: Kysely<any>

  constructor({
    db,
    base,
    model,
  }: {
    model: ModelType
    base: BaseType
    db: Kysely<any>
  }) {
    this.model = model
    this.base = base
    this.db = db
  }

  async select(source: SelectQueryType & NameType) {}

  async create(source: CreateQueryType & NameType) {}

  async update(source: UpdateQueryType & NameType) {}

  async remove(source: RemoveQueryType & NameType) {}

  async extend(source: ExtendQueryType & NameType) {}
}
