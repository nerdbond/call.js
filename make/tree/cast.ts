import { toPascalCase } from '~/code/tool'
import { MakeTakeCast } from '../cast'
import { FormCast } from '~/code/cast'

export default function make(take: MakeTakeCast) {
  const list: Array<string> = []

  list.push(
    `import { List } from '@wavebond/work/host/code/cast/tree/list'`,
  )

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

  list.push(`export type ${toPascalCase(name)} = {`)
  make_link_list({ mesh_form, ...take }).forEach(line => {
    list.push(`  ${line}`)
  })
  list.push(`}`)

  return list
}

export function make_link_list({
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
        list.push(`  ${name}?: Date`)
        break
      case 'string':
      case 'uuid':
        list.push(`  ${name}?: string`)
        break
      case 'integer':
      case 'decimal':
        list.push(`  ${name}?: number`)
        break
      case 'boolean':
        list.push(`  ${name}?: boolean`)
        break
      case 'json':
        list.push(`  ${name}?: object`)
        break
      default:
        if (link.like && take.mesh[link.like]) {
          const type = `${toPascalCase(link.like)}`
          if (link.list) {
            list.push(`  ${name}?: List<${type}>`)
          } else {
            list.push(`  ${name}?: ${type}`)
          }
        } else if (link.like && take.form[link.like]) {
          const form = take.form[link.like]
          if (form.like) {
            let type: string
            switch (form.like) {
              case 'timestamp':
                type = `Date`
                break
              case 'string':
              case 'uuid':
                type = `string`
                break
              case 'integer':
              case 'decimal':
                type = `number`
                break
              case 'boolean':
                type = `boolean`
                break
              case 'json':
                type = `object`
                break
              default:
                type = `${toPascalCase(form.like)}`
                break
            }
            if (link.list) {
              list.push(`  ${name}?: List<${type}>`)
            } else {
              list.push(`  ${name}?: ${type}`)
            }
          } else {
            console.log(name, form)
            throw new Error(`Link must have like`)
          }
        } else if (link.link) {
          list.push(`  ${name}?: {`)
          make_link_list({ ...take, mesh_form: link }).forEach(line => {
            list.push(`  ${line}`)
          })
          list.push(`}`)
        } else {
          console.log(typeof link.like)
          console.log(name, link)
          throw new Error(`Link must have like or link`)
        }
    }
  }

  return list
}
