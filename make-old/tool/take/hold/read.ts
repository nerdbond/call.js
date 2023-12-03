import { BaseCast } from '~/code/cast/mesh'
import { ReadHaveCast, ReadHaveBondCast } from '~/code/form/hold/read'
import { FormLinkBaseCast, FormLinkCast } from '~/code/cast/form'
import { hookFind } from './move'
import { toPascalCase } from '~/code/tool'

export function hookContainer({
  base,
  form,
  read,
  isList = false,
  rise,
  line,
}: {
  base: BaseCast
  form: FormLinkBaseCast
  read: ReadHaveCast
  isList?: boolean
  rise: Array<string>
  line: Array<string>
}) {
  const list: Array<string> = []

  if (isList) {
    list.push(`total: z.optional(z.boolean()),`)
    list.push(`randomize: z.optional(z.boolean()),`)

    if ('seek' in read && read.seek) {
      hookFind({ base, seek: read.seek }).forEach(line => {
        list.push(line)
      })
    }
  }

  if (read.read) {
    list.push(`read: z.optional(`)
    list.push(`  z.object({`)

    hookEachProperty({
      base,
      form,
      read: read.read,
      rise,
      line,
    }).forEach(line => {
      list.push(`    ${line}`)
    })

    list.push(`  })`)
    list.push(`),`)
  }

  const nameName = line.map(toPascalCase).join('_')
  const nameList: Array<string> = [``]
  nameList.push(`export const ${nameName}Extend = z.object({`)
  list.forEach(line => {
    nameList.push(`  ${line}`)
  })
  nameList.push(`})`)

  rise.push(...nameList)

  list.length = 0

  list.push(`${nameName}Extend.merge(`)
  list.push(`  z.object({`)
  list.push(`    name: z.record(z.string(), ${nameName}Extend)`)
  list.push(`  })`)
  list.push(`),`)

  return list
}

export function hookEachProperty({
  base,
  form,
  read,
  line,
  rise,
}: {
  base: BaseCast
  form: FormLinkBaseCast
  read: ReadHaveCast
  rise: Array<string>
  line: Array<string>
}) {
  const list: Array<string> = []

  for (const name in read) {
    const childExtend = read[name]
    const childProperty = form.link?.[name]

    if (childProperty) {
      hookProperty({
        name,
        base,
        link: childProperty,
        read: childExtend,
        rise,
        line,
      }).forEach(line => {
        list.push(`  ${line}`)
      })
    }
  }

  return list
}

export function hookProperty({
  name,
  base,
  link,
  read,
  rise,
  line,
}: {
  name: string
  base: BaseCast
  link: FormLinkCast
  read: ReadHaveBondCast
  rise: Array<string>
  line: Array<string>
}) {
  const list: Array<string> = []

  switch (link.like) {
    case 'timestamp':
    case 'text':
    case 'uuid':
    case 'integer':
    case 'decimal':
    case 'json':
    case 'boolean':
      list.push(`${name}: z.optional(z.boolean()),`)
      break
    case 'object':
      if (typeof read === 'object') {
        list.push(`${name}: z.optional(`)
        hookContainer({
          base,
          form: link,
          isList: false,
          read,
          rise,
          line: line.concat([name]),
        }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`),`)
      }
      break
    case 'record':
      if (typeof read === 'object' && read.case) {
        list.push(`${name}: z.optional(`)
        list.push(`  z.union([`)
        for (const name in read.case) {
          const container = read.case[name]
          const childSchema = base[name]
          hookContainer({
            base,
            form: childSchema,
            isList: !!link.list,
            read: container,
            rise,
            line: line.concat([name]),
          }).forEach(line => {
            list.push(`    ${line}`)
          })
        }
        list.push(`  ])`)
        list.push(`),`)
      }
      break
    default: {
      if (typeof read === 'object' && link.like) {
        const childSchema = base[link.like]
        list.push(`${name}: z.optional(`)
        hookContainer({
          base,
          form: childSchema,
          read,
          isList: !!link.list,
          rise,
          line: line.concat([name]),
        }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`),`)
      }
    }
  }

  return list
}
