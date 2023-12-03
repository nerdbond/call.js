import { FormCast } from '~/code/cast/form'
import * as readTool from '~/make/tool/load/hold/read'
import * as manageTool from '~/make/tool/load/hold/move'
import { ReadHaveCast } from '~/code/form/hold/read'
import { BaseCast } from '~/code/cast/base'
import { HaveCast } from '~/code/form/hold'
import { toPascalCase } from '~/code/tool'
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
  textList.push(`import { z } from 'zod'`)
  textList.push(`import { Filter } from '@wavebond/call'`)
  textList.push(`import * as Type from '.'`)
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
          textList.push(line)
        })
        break
    }

    rise.push(...textList)
  }

  for (const { name, call } of list) {
    const textList: Array<string> = []

    textList.push(``)

    switch (name) {
      case 'create':
        hookCreate({
          name,
          base,
          form,
          mutate: call as MakeHaveCast,
        }).forEach(line => {
          textList.push(line)
        })
        break
      case 'update':
        hookUpdate({
          name,
          base,
          form,
          mutate: call as SaveHaveCast,
        }).forEach(line => {
          textList.push(line)
        })
        break
      case 'remove':
        hookRemove({
          name,
          base,
          form,
          mutate: call as TossHaveCast,
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

  list.push(`export const Extend =`)

  readTool
    .hookContainer({ base, form, read, rise, line: ['base'] })
    .forEach(line => {
      list.push(`  ${line}`)
    })

  return list
}

export function hookCreate({
  name,
  base,
  form,
  mutate,
}: {
  name: string
  base: BaseCast
  form: FormCast
  mutate: MakeHaveCast
}) {
  const list: Array<string> = []

  const typeName = toPascalCase(name)
  list.push(`export const ${typeName} =`)

  manageTool.hookSchema({ base, mutate }).forEach(line => {
    list.push(`  ${line}`)
  })

  return list
}

export function hookUpdate({
  name,
  base,
  form,
  mutate,
}: {
  name: string
  base: BaseCast
  form: FormCast
  mutate: SaveHaveCast
}) {
  const list: Array<string> = []

  const typeName = toPascalCase(name)
  list.push(`export const ${typeName} =`)

  manageTool.hookSchema({ base, mutate }).forEach(line => {
    list.push(`  ${line}`)
  })

  return list
}

export function hookRemove({
  name,
  base,
  form,
  mutate,
}: {
  name: string
  base: BaseCast
  form: FormCast
  mutate: TossHaveCast
}) {
  const list: Array<string> = []

  const typeName = toPascalCase(name)
  list.push(`export const ${typeName} =`)

  manageTool.hookSchema({ base, mutate }).forEach(line => {
    list.push(`  ${line}`)
  })

  return list
}
