import {
  BaseCast,
  ToolCast,
  MakeCallCast,
  ReadCallCast,
  TossCallCast,
  LoadCallCast,
  SaveCallCast,
} from '../../form'
import { Kysely } from 'kysely'

export type NameCast = {
  name: string
}

export class Robe {
  tool: ToolCast
  base: BaseCast
  hold: Kysely<any>

  constructor({
    hold,
    base,
    tool,
  }: {
    tool: ToolCast
    base: BaseCast
    hold: Kysely<any>
  }) {
    this.tool = tool
    this.base = base
    this.hold = hold
  }

  async select(call: LoadCallCast & NameCast) {}

  async create(call: MakeCallCast & NameCast) {}

  async update(call: SaveCallCast & NameCast) {}

  async remove(call: TossCallCast & NameCast) {}

  async extend(call: ReadCallCast & NameCast) {}
}
