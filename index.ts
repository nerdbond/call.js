import { z } from 'zod'
import kink from '~/code/kink'
import _ from 'lodash'
import { CallCast, ReadCallCast } from './code/cast'
import { loadKink } from './code/host/kink'
import { makeCall } from './code/host'

export * from './code/cast'

export type WorkLoadBaseCast = Record<string, WorkLoadCast>

export type WorkTaskBaseCast = Record<string, WorkTaskCast>

export type TakeCast = z.ZodType<z.ZodTypeAny>

export type WorkLoadCast = {
  read: ReadCallCast
  take: TakeCast
}

export type WorkTaskCast = {
  take: TakeCast
}

export type WorkTakeCast = {
  host?: string
  code?: string
  load?: WorkLoadBaseCast
  task?: WorkTaskBaseCast
}

export default class Work {
  protected loadBase: WorkLoadBaseCast

  protected taskBase: WorkTaskBaseCast

  protected codeText?: string

  protected hostText?: string

  constructor(take?: WorkTakeCast) {
    this.loadBase = {}
    this.taskBase = {}

    if (take?.host) {
      this.host(take.host)
    }

    if (take?.code) {
      this.code(take.code)
    }

    if (take?.load) {
      this.load(take.load)
    }

    if (take?.task) {
      this.task(take.task)
    }
  }

  code(code: string) {
    this.codeText = code
    return this
  }

  host(host: string) {
    this.hostText = host
    return this
  }

  load(base: WorkLoadBaseCast) {
    _.extend(this.loadBase, base)
  }

  task(base: WorkTaskBaseCast) {
    _.extend(this.taskBase, base)
  }

  async call(name: string, call: CallCast) {
    if (!this.taskBase[name]) {
      throw new Error(`Unknown task '${name}'`)
    }

    const { take } = this.taskBase[name]

    let callHead

    try {
      // will throw an error
      callHead = take.parse(call)
    } catch (e) {
      return loadKink(e)
    }

    if (!callHead) {
      return
    }

    if (!this.hostText || !this.codeText) {
      return loadKink(kink('call_fail'))
    }

    return await makeCall(this.hostText, this.codeText, callHead)
  }
}
