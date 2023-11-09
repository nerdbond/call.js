import { ReadCallCast } from '../../form'
import { ZodType } from 'zod'

export function moveHoldFormToSite(
  base: Record<string, any>,
  head: Record<string, any> = {},
) {
  for (const baseLink in base) {
    const baseLine = baseLink.split('__')
    let site = head
    for (let i = 0; i < baseLine.length - 1; i++) {
      const basePart = baseLine[i]
      site = site[basePart] ??= {}
    }
    site[baseLine[baseLine.length - 1]] = base[baseLink]
  }

  return head
}

export type NestCallMesh = Record<string, NestCallTask>

export type NestCallTask = (
  id: string,
  read: ReadCallCast,
  readForm?: ZodType<any>,
) => any
