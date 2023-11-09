import { HoldCast, MoveHoldCast } from '~/code/form/hold'
import * as readTool from '~/code/make/tool/form/hold/read'
import * as moveTool from '~/code/make/tool/form/hold/move'
import { BaseCast } from '~/code/form/base'
import { FormCast } from '~/code/form/form'
import { toPascalCase } from '~/code/tool'
import { ReadHoldCast } from '~/code/form/hold/read'
import { MakeHoldCast } from '~/code/form/hold/make'
import { SaveHoldCast } from '~/code/form/hold/save'
import { TossHoldCast } from '~/code/form/hold/toss'

export default function hook({
  base,
  form,
  list,
}: {
  base: BaseCast
  form: FormCast
  list: Array<{
    name: string
    call: HoldCast
  }>
}) {
  const textList: Array<string> = []
  textList.push(`import { Filter } from '@wavebond/call'`)
  hookEach({ base, form, list, rise: textList })
  return textList
}

export function hookEach({
  base,
  form,
  list,
  rise,
}: {
  base: BaseCast
  form: FormCast
  list: Array<{
    name: string
    call: HoldCast
  }>
  rise: Array<string>
}) {
  for (const { name, call } of list) {
    const textList: Array<string> = []

    textList.push(``)

    switch (name) {
      case 'read':
        hookExtend({
          name,
          base,
          form,
          read: call as ReadHoldCast,
          rise,
        }).forEach(line => {
          textList.push(`  ${line}`)
        })
        break
      case 'create':
        hookCreate({
          name,
          base,
          form,
          move: call as MakeHoldCast,
        }).forEach(line => {
          textList.push(line)
        })
        break
      case 'update':
        hookUpdate({
          name,
          base,
          move: call as SaveHoldCast,
        }).forEach(line => {
          textList.push(line)
        })
        break
      case 'remove':
        hookRemove({
          name,
          base,
          move: call as TossHoldCast,
        }).forEach(line => {
          textList.push(line)
        })
        break
    }

    rise.push(...textList)
  }
}

export function hookExtend({
  name,
  base,
  form,
  read,
  rise,
}: {
  name: string
  base: BaseCast
  form: FormCast
  read: ReadHoldCast
  rise: Array<string>
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type =`)

  readTool
    .hookContainer({
      base,
      form,
      read,
      rise,
      line: ['base'],
      isList: true,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}

export function hookCreate({
  name,
  base,
  form,
  move,
}: {
  name: string
  base: BaseCast
  form: FormCast
  move: MakeHoldCast
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type =`)
  moveTool
    .hookForm({
      base,
      move,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}

export function hookUpdate({
  name,
  base,
  move,
}: {
  name: string
  base: BaseCast
  move: SaveHoldCast
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type =`)
  moveTool
    .hookForm({
      base,
      move,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}

export function hookRemove({
  name,
  base,
  move,
}: {
  name: string
  base: BaseCast
  move: TossHoldCast
}) {
  const list: Array<string> = []

  list.push(`export type ${toPascalCase(name)}Type =`)
  moveTool
    .hookForm({
      base,
      move,
    })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}
