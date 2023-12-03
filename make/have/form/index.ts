import { HaveCast, MoveHaveCast } from '~/code/form/hold'
import * as readTool from '~/make/tool/form/hold/read'
import * as moveTool from '~/make/tool/form/hold/move'
import { BaseCast } from '~/code/cast/base'
import { FormCast } from '~/code/cast/form'
import { toPascalCase } from '~/code/tool'
import { ReadHaveCast } from '~/code/form/hold/read'
import { MakeHaveCast } from '~/code/form/hold/make'
import { SaveHaveCast } from '~/code/form/hold/save'
import { TossHaveCast } from '~/code/form/hold/toss'

export default function hook({
  base,
  form,
  list,
}: {
  base: BaseCast
  form: FormCast
  list: Array<{
    name: string
    call: HaveCast
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
    call: HaveCast
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
          read: call as ReadHaveCast,
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
          move: call as MakeHaveCast,
        }).forEach(line => {
          textList.push(line)
        })
        break
      case 'update':
        hookUpdate({
          name,
          base,
          move: call as SaveHaveCast,
        }).forEach(line => {
          textList.push(line)
        })
        break
      case 'remove':
        hookRemove({
          name,
          base,
          move: call as TossHaveCast,
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
  read: ReadHaveCast
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
  move: MakeHaveCast
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
  move: SaveHaveCast
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
  move: TossHaveCast
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
