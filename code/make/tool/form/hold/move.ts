import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/form/base'
import { SeekHoldCast } from '~/code/form/hold/seek'
import { FormLinkBaseCast, FormLinkCast } from '~/code/form/form'
import { MoveHoldCast } from '~/code/form'

export type SeekLinkCast = {
  line: Array<string>
  like: string
  need?: boolean
}

export function hookSeek({
  base,
  seek,
  need,
}: {
  base: BaseCast
  seek: SeekHoldCast
  need?: boolean
}) {
  const list: Array<string> = []

  if (Array.isArray(seek)) {
    list.push(`seek${need ? '?' : ''}:`)
    seek.forEach(seek => {
      list.push(`  | {`)
      hookEachLink({
        base,
        schema: { like: 'object', link: seek },
      }).forEach(line => {
        list.push(`    ${line}`)
      })
      list.push(`  }`)
    })
  } else {
    const lineList: Array<SeekLinkCast> = []
    const line = []
    hookEachSeekLink({
      base,
      schema: { like: 'object', link: seek },
      list: lineList,
      line,
    })
    const seekPathList: Array<string> = []
    lineList.forEach(link => {
      const seekText = loadSeekForm(link.like)
      if (seekText) {
        seekPathList.push(`${seekText}`)
      }
    })
    list.push(
      `seek${need ? '?' : ''}: Seek.SeekCallCast<${seekPathList.join(
        ' | ',
      )}>`,
    )
  }

  return list
}

function loadSeekForm(like: string) {
  switch (like) {
    case 'string':
      return `Seek.SeekStringForm`
    case 'number':
      return `Seek.SeekNumberForm`
    case 'date':
      return `Seek.SeekDateForm`
    case 'boolean':
      return `Seek.SeekBooleanForm`
  }
}

export function hookForm({
  base,
  move,
}: {
  base: BaseCast
  move: MoveHoldCast
}) {
  const list: Array<string> = []
  list.push(`{`)

  if ('seek' in move && move.seek) {
    hookSeek({ base, seek: move.seek }).forEach(line => {
      list.push(`  ${line}`)
    })
  }

  if ('have' in move && move.have) {
    list.push(`  have: {`)
    hookEachLink({
      base,
      schema: { like: 'object', link: move.have },
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
  schema,
}: {
  base: BaseCast
  schema: FormLinkBaseCast
}) {
  const list: Array<string> = []
  for (const name in schema.link) {
    const link = schema.link[name]

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
  const need = link.need ? '?' : ''
  const listPrefix = link.list ? `Array<` : ''
  const listSuffix = link.list ? `>` : ''

  function push(expression: string) {
    list.push(`${name}${need}: ${listPrefix}${expression}${listSuffix}`)
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
      list.push(`${name}${need}: ${listPrefix}{`)
      hookEachLink({ base, schema: link }).forEach(line => {
        list.push(`  ${line}`)
      })
      list.push(`}${listSuffix}`)
      break
    default:
      throw new Error(`Invalid Hold like link '${link.like}'`)
  }

  return list
}

export function hookEachSeekLink({
  base,
  schema,
  list,
  line,
}: {
  base: BaseCast
  schema: FormLinkBaseCast
  list: Array<SeekLinkCast>
  line: Array<string>
}) {
  for (const name in schema.link) {
    const link = schema.link[name]

    hookSeekLink({
      base,
      name,
      link,
      list,
      line: line.concat([name]),
    })
  }
}

export function hookSeekLink({
  name,
  base,
  link,
  list,
  line,
}: {
  base: BaseCast
  name: string
  link: FormLinkCast
  list: Array<SeekLinkCast>
  line: Array<string>
}) {
  const need = link.need ? '?' : ''
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
      hookEachSeekLink({
        base,
        schema: link,
        list,
        line,
      })
      // list.push(`}${listSuffix}`)
      break
    default:
      throw new Error(`Invalid Hold like link '${link.like}'`)
  }

  return list
}
