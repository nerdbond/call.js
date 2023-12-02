import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/cast/base'
import { FindHaveCast } from '~/code/form/hold/seek'
import { FormLinkBaseCast, FormLinkCast } from '~/code/cast/form'
import { MoveHaveCast } from '~/code/cast'

export type FindLinkCast = {
  line: Array<string>
  like: string
  need?: boolean
}

export function hookFind({
  base,
  seek,
  need,
}: {
  base: BaseCast
  seek: FindHaveCast
  need?: boolean
}) {
  const list: Array<string> = []

  if (Array.isArray(seek)) {
    list.push(`seek${!need ? '?' : ''}:`)
    seek.forEach(seek => {
      list.push(`  | {`)
      hookEachLink({
        base,
        form: { like: 'object', link: seek },
      }).forEach(line => {
        list.push(`    ${line}`)
      })
      list.push(`  }`)
    })
  } else {
    const lineList: Array<FindLinkCast> = []
    const line = []
    hookEachFindLink({
      base,
      form: { like: 'object', link: seek },
      list: lineList,
      line,
    })
    const seekPathList: Array<string> = []
    lineList.forEach(link => {
      const seekText = loadFindForm(link.like)
      if (seekText) {
        seekPathList.push(`${seekText}`)
      }
    })
    list.push(
      `seek${!need ? '?' : ''}: Find.FindCallCast<${seekPathList.join(
        ' | ',
      )}>`,
    )
  }

  return list
}

function loadFindForm(like: string) {
  switch (like) {
    case 'string':
      return `Find.FindStringForm`
    case 'number':
      return `Find.FindNumberForm`
    case 'date':
      return `Find.FindDateForm`
    case 'boolean':
      return `Find.FindBooleanForm`
  }
}

export function hookForm({
  base,
  move,
}: {
  base: BaseCast
  move: MoveHaveCast
}) {
  const list: Array<string> = []
  list.push(`{`)

  if ('seek' in move && move.seek) {
    hookFind({ base, seek: move.seek }).forEach(line => {
      list.push(`  ${line}`)
    })
  }

  if ('have' in move && move.have) {
    list.push(`  have: {`)
    hookEachLink({
      base,
      form: { like: 'object', link: move.have },
    }).forEach(line => {
      list.push(`    ${line}`)
    })
    list.push(`  }`)
  }

  list.push(`}`)

  if ('read' in move && move.read) {
    list.push(` & ${toPascalCase(move.read)}Form`)
  } else {
    list.push(` & ExtendForm`)
  }

  return list
}

export function hookEachLink({
  base,
  form,
}: {
  base: BaseCast
  form: FormLinkBaseCast
}) {
  const list: Array<string> = []
  for (const name in form.link) {
    const link = form.link[name]

    hookLink({ base, name, link }).forEach(line => {
      list.push(`${line}`)
    })
  }
  return list
}

export function hookLink({
  name,
  base,
  link,
}: {
  base: BaseCast
  name: string
  link: FormLinkCast
}) {
  const list: Array<string> = []
  const optional = !link.need ? '?' : ''
  const listPrefix = link.list ? `Array<` : ''
  const listSuffix = link.list ? `>` : ''

  function push(expression: string) {
    list.push(
      `${name}${optional}: ${listPrefix}${expression}${listSuffix}`,
    )
  }

  switch (link.like) {
    case 'timestamp':
      push(`date`)
      break
    case 'text':
    case 'uuid':
      push(`string`)
      break
    case 'integer':
    case 'decimal':
      push(`number`)
      break
    case 'boolean':
      push(`boolean`)
      break
    case 'json':
      push(`object`)
      break
    case 'object':
    case undefined:
      list.push(`${name}${optional}: ${listPrefix}{`)
      hookEachLink({ base, form: link }).forEach(line => {
        list.push(`  ${line}`)
      })
      list.push(`}${listSuffix}`)
      break
    default:
      throw new Error(`Invalid Have like link '${link.like}'`)
  }

  return list
}

export function hookEachFindLink({
  base,
  form,
  list,
  line,
}: {
  base: BaseCast
  form: FormLinkBaseCast
  list: Array<FindLinkCast>
  line: Array<string>
}) {
  for (const name in form.link) {
    const link = form.link[name]

    hookFindLink({
      base,
      name,
      link,
      list,
      line: line.concat([name]),
    })
  }
}

export function hookFindLink({
  name,
  base,
  link,
  list,
  line,
}: {
  base: BaseCast
  name: string
  link: FormLinkCast
  list: Array<FindLinkCast>
  line: Array<string>
}) {
  const optional = link.need ? '?' : ''
  const listPrefix = link.list ? `Array<` : ''
  const listSuffix = link.list ? `>` : ''

  // function push(expression: string) {
  //   list.push(
  //     `${name}${need}: ${listPrefix}${expression}${listSuffix}`,
  //   )
  // }

  switch (link.like) {
    case 'timestamp':
      list.push({ like: `date`, line, need: !!link.need })
      break
    case 'text':
    case 'uuid':
      list.push({ like: `string`, line, need: !!link.need })
      break
    case 'integer':
    case 'decimal':
      list.push({ like: `number`, line, need: !!link.need })
      break
    case 'boolean':
      list.push({
        like: `boolean`,
        line,
        need: !!link.need,
      })
      break
    case 'json':
      list.push({ like: `object`, line, need: !!link.need })
      break
    case 'object':
    case undefined:
      // list.push(`${name}${need}: ${listPrefix}{`)
      hookEachFindLink({
        base,
        form: link,
        list,
        line,
      })
      // list.push(`}${listSuffix}`)
      break
    default:
      throw new Error(`Invalid Have like link '${link.like}'`)
  }

  return list
}
