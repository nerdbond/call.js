import { toPascalCase } from '~/code/tool'
import { BaseCast } from '~/code/form/base'
import { HoldCast } from '~/code/form/hold'
import { SeekHoldCast } from '~/code/form/hold/seek'
import { FormLinkBaseCast, FormLinkCast } from '~/code/form/form'
import { SeekLinkCast } from '../../form/hold/move'

export function hookSeek({
  base,
  seek,
}: {
  base: BaseCast
  seek: SeekHoldCast
}) {
  const list: Array<string> = []

  if (Array.isArray(seek)) {
    list.push(`seek: z.union([`)
    seek.forEach(seek => {
      list.push(`  z.object({`)
      hookEachLink({
        base,
        form: { like: 'object', link: seek },
      }).forEach(line => {
        list.push(`    ${line}`)
      })
      list.push(`  }),`)
    })
    list.push(`]),`)
  } else {
    const lineList: Array<SeekLinkCast> = []
    const line = []
    hookEachSeekLink({
      base,
      form: { like: 'object', link: seek },
      list: lineList,
      line,
    })
    const seekPathList: Array<string> = []
    lineList.forEach(link => {
      const seekText = loadSeekCast(link.like)
      if (seekText) {
        seekPathList.push(`${seekText}(${JSON.stringify(link.line)})`)
      }
    })

    if (seekPathList.length > 1) {
      list.push(`seek: Seek.SeekQuery([${seekPathList.join(', ')}]),`)
    } else {
      list.push(`seek: Seek.SeekQuery(${seekPathList[0]}),`)
    }
  }

  return list
}
function loadSeekCast(like: string) {
  switch (like) {
    case 'string':
      return `Seek.SeekString`
    case 'number':
      return `Seek.SeekNumber`
    case 'date':
      return `Seek.SeekDate`
    case 'boolean':
      return `Seek.SeekBoolean`
  }
}

export function hookSchema({
  base,
  mutate,
}: {
  base: BaseCast
  mutate: HoldCast
}) {
  const list: Array<string> = []
  list.push(`z.object({`)

  if ('seek' in mutate && mutate.seek) {
    hookSeek({ base, seek: mutate.seek }).forEach(line => {
      list.push(`  ${line}`)
    })
  }

  if ('have' in mutate && mutate.have) {
    list.push(`  have: z.object({`)
    hookEachLink({
      base,
      form: { like: 'object', link: mutate.have },
    }).forEach(line => {
      list.push(`    ${line}`)
    })
    list.push(`  }),`)
  }

  list.push(`})`)

  if ('read' in mutate && typeof mutate.read === 'string') {
    list.push(`.merge(${toPascalCase(mutate.read)})`)
  } else {
    list.push(`.merge(Extend)`)
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

    hookLink({
      name,
      base,
      link,
    }).forEach(line => {
      list.push(line)
    })
  }

  return list
}

export function hookLink({
  name,
  base,
  link,
}: {
  name: string
  base: BaseCast
  link: FormLinkCast
}) {
  const list: Array<string> = []

  switch (link.like) {
    case 'timestamp':
      push(name, `z.coerce.date()`)
      break
    case 'text':
      push(name, `z.string().trim()`)
      break
    case 'uuid':
      push(name, `z.string().uuid()`)
      break
    case 'integer':
      push(name, `z.number().int()`)
      break
    case 'decimal':
      push(name, `z.number()`)
      break
    case 'boolean':
      push(name, `z.boolean()`)
      break
    case 'json':
      push(name, `z.object({}).passthrough()`)
      break
    case 'object':
    case undefined: {
      if (link.need) {
        list.push(`${name}: z.optional(`)
        list.push(`  z.object({`)
        hookEachLink({ base, form: link }).forEach(line => {
          list.push(`    ${line}`)
        })
        list.push(`  })`)
        list.push(`),`)
      } else {
        list.push(`${name}: z.object({`)
        hookEachLink({ base, form: link }).forEach(line => {
          list.push(`  ${line}`)
        })
        list.push(`}),`)
      }
      break
    }
    default:
      throw new Error(`Invalid Hold manage link '${link.like}'`)
  }

  return list

  function push(name: string, expression: string) {
    const text = link.need ? `z.optional(${expression})` : expression
    list.push(`${name}: ${text},`)
  }
}

export function hookEachSeekLink({
  base,
  form,
  list,
  line,
}: {
  base: BaseCast
  form: FormLinkBaseCast
  list: Array<SeekLinkCast>
  line: Array<string>
}) {
  for (const name in form.link) {
    const link = form.link[name]

    hookSeekLink({
      name,
      base,
      link,
      list,
      line: line.concat([name]),
    })
  }
}

export function hookSeekLink({
  name,
  base,
  list,
  line,
  link,
}: {
  name: string
  base: BaseCast
  link: FormLinkCast
  list: Array<SeekLinkCast>
  line: Array<string>
}) {
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
        form: link,
        list,
        line,
      })
      // list.push(`}${listSuffix}`)
      break
    default:
      throw new Error(`Invalid Hold like link '${link.like}'`)
  }
}
