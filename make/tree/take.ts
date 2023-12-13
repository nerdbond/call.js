import { toPascalCase } from '~/code/tool'
import { MakeTakeCast } from '../cast'
import { FormCast } from '~/code/cast'

export default function make(take: MakeTakeCast) {
  const list: Array<string> = []

  list.push(`import { z } from 'zod'`)
  list.push(
    `import { list } from '@termsurf/work/host/code/cast/tree/list'`,
  )
  list.push(
    `import { site } from '@termsurf/work/host/code/cast/tree/site'`,
  )
  list.push(`import * as Cast from './cast'`)

  for (const name in take.mesh) {
    list.push(``)
    make_site({ name, ...take }).forEach(line => {
      list.push(line)
    })
  }

  return list
}

export function make_site({
  name,
  ...take
}: {
  name: string
} & MakeTakeCast) {
  const list: Array<string> = []
  const mesh_form = take.mesh[name]

  const typeName = toPascalCase(name)

  list.push(
    `export const ${typeName}: z.ZodType<Cast.${typeName}> = z.object({`,
  )

  make_list_link({ ...take, mesh_form }).forEach(line => {
    list.push(`  ${line}`)
  })

  list.push(`})`)

  return list
}

export function make_list_link({
  mesh_form,
  ...take
}: {
  mesh_form: FormCast
} & MakeTakeCast) {
  const list: Array<string> = []
  for (const name in mesh_form.link) {
    const link = mesh_form.link[name]
    switch (link.like) {
      case 'timestamp':
        list.push(`  ${name}: z.optional(z.coerce.date()),`)
        break
      case 'string':
        list.push(`  ${name}: z.optional(z.string().trim()),`)
        break
      case 'uuid':
        list.push(`  ${name}: z.optional(z.string().uuid()),`)
        break
      case 'integer':
        list.push(`  ${name}: z.optional(z.number().int()),`)
        break
      case 'decimal':
        list.push(`  ${name}: z.optional(z.number()),`)
        break
      case 'boolean':
        list.push(`  ${name}: z.optional(z.boolean()),`)
        break
      case 'json':
        list.push(`  ${name}: z.optional(z.object({}).passthrough()),`)
        break
      default:
        if (link.like && take.mesh[link.like]) {
          const type = toPascalCase(link.like)
          // : 'z.object({}).passthrough()'
          if (link.list) {
            list.push(`  ${name}: list(() => ${type}),`)
          } else {
            list.push(`  ${name}: site(() => ${type}),`)
          }
        } else if (link.link) {
          list.push(`  ${name}: z.optional(z.object({`)
          make_list_link({ ...take, mesh_form: link }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`})),`)
        } else if (link.like && take.form[link.like]) {
          const form = take.form[link.like]
          if (form.like) {
            let type: string
            let isCast = false
            switch (form.like) {
              case 'timestamp':
                type = `z.coerce.date()`
                break
              case 'string':
                type = `z.string()`
                break
              case 'uuid':
                type = `z.string().uuid()`
                break
              case 'integer':
                type = `z.number().int()`
                break
              case 'decimal':
                type = `z.number()`
                break
              case 'boolean':
                type = `z.boolean()`
                break
              case 'json':
                type = `z.passthrough({})`
                break
              default:
                type = `${toPascalCase(form.like)}`
                isCast = true
                break
            }
            if (link.list) {
              if (isCast) {
                list.push(`  ${name}: list(() => ${type}),`)
              } else {
                list.push(`  ${name}: z.array(${type}),`)
              }
            } else {
              if (isCast) {
                list.push(`  ${name}: site(() => ${type}),`)
              } else {
                list.push(`  ${name}: ${type},`)
              }
            }
          } else {
            console.log(name, form)
            throw new Error(`Link must have like`)
          }
        } else {
          console.log(name, link)
          throw new Error(`Link must have like or link`)
        }
    }
  }

  return list
}
