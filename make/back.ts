import loveCode from '@tunebond/love-code'
import { Base } from '../index.js'
import {
  formCodeCase,
  makeFormText,
  makeFormZodText,
  makeFoot,
  testForm,
  SLOT,
  makeHead,
} from './base.js'

export default async function make(base: Base, baseLink: string) {
  const form = await makeForm(base)
  const load = await makeLoad(base, baseLink)
  return { form, load }
}

async function makeForm(base: Base) {
  const list: Array<string> = []

  list.push(...makeHead())
  list.push(`export namespace Form {`)
  for (const name in base.form) {
    const form = base.form[name]
    if (!form) {
      continue
    }

    if (testForm(form)) {
      list.push(`export type ${formCodeCase(name)} = {`)

      for (const linkName in form.link) {
        const link = form.link[linkName]
        if (!link) {
          continue
        }
        if (link.list) {
          continue
        }

        const makeLinkName = link.site ? link.site.name : linkName

        const formText = link.site
          ? makeFormText(link.site.form)
          : Array.isArray(link.form)
          ? link.form.map(makeFormText).join(' | ')
          : makeFormText(link.form)

        if (link.void) {
          list.push(`${makeLinkName}?: ${formText} | null | undefined`)
        } else {
          list.push(`${makeLinkName}: ${formText}`)
        }
      }
      list.push(`}`)
      list.push(``)
    }
  }
  list.push(`}`)
  list.push(``)
  list.push(`export type Base = {`)
  for (const name in base.form) {
    const form = base.form[name]
    if (testForm(form)) {
      list.push(`${name}: Form.${formCodeCase(name)}`)
    }
  }
  list.push(`}`)
  list.push(``)
  list.push(`export type Name = keyof Base`)
  list.push(``)

  const text = await loveCode(list.join('\n'))

  return text
}

async function makeLoad(base: Base, baseLink: string) {
  const list: Array<string> = []

  list.push(...makeHead())
  list.push(`import { z } from 'zod'`)
  list.push(
    `import { bondHalt, testHave, testTake } from '@tunebond/call'`,
  )
  list.push(`import Load from '../form/load.js'`)
  list.push(`import base from '../${baseLink}'`)
  list.push(`import { FormLinkHostMoveName } from '@tunebond/form'`)
  list.push(`import { Form, Name, Base } from './form.js'`)

  const linkMesh: Record<string, string> = {}
  const formMesh: Record<string, Record<string, string>> = {}

  for (const name in base.form) {
    const form = base.form[name]
    if (!form) {
      continue
    }

    if (testForm(form)) {
      // 1. calculate the base link schemas
      for (const linkName in form.link) {
        const link = form.link[linkName]
        if (!link || link.list) {
          continue
        }

        const makeLinkName = link.site ? link.site.name : linkName

        const bond: Array<string> = []

        if (link.void) {
          bond.push(`z.optional(`)
        }

        if (link.site) {
          bond.push(makeFormZodText(link.site.form, base))
        } else if (Array.isArray(link.form)) {
          bond.push(`z.union(`)
          link.form.forEach(form => {
            bond.push(makeFormZodText(form, base) + ',')
          })
          bond.push(`)`)
        } else {
          bond.push(makeFormZodText(link.form, base))
        }

        if (link.void) {
          bond.push(`)`)
        }

        const bondHaltList: Array<string> = []

        if (link.take) {
          bondHaltList.push(
            `bondHalt('link_take', lead, bind, { test: () => testTake(lead, { take: base.form.${name}.link.${linkName}.take }) })`,
          )
        }

        if (bondHaltList.length) {
          bond.push(`.superRefine((lead, bind) => {`)
          bond.push(...bondHaltList)
          bond.push(`})`)
        }

        const loadName = `${formCodeCase(name)}_${formCodeCase(
          makeLinkName,
        )}_Load`

        const bondText = bond.join('\n')
        list.push(`const ${loadName} = ${bondText}`)

        linkMesh[loadName] = bondText
      }

      // 2. calculate the transform schemas
      for (const linkName in form.link) {
        const link = form.link[linkName]
        if (!link || link.list) {
          continue
        }

        const makeLinkName = link.site ? link.site.name : linkName

        SLOT.forEach(slot => {
          const move = link.host?.back?.[slot]
          const loadName = `${formCodeCase(name)}_${formCodeCase(
            makeLinkName,
          )}_Load`
          const bondText = linkMesh[loadName]
          const slotLoadName = `${formCodeCase(name)}_${formCodeCase(
            makeLinkName,
          )}_${formCodeCase(slot)}_Load`

          if (move) {
            list.push(
              `const ${slotLoadName} = ${bondText}.transform(base.form.${name}.link.${linkName}.host.back.${slot})`,
            )
          } else {
            list.push(`const ${slotLoadName} = ${loadName}`)
          }
        })
      }

      // 3. define the 4 transform types for each
      SLOT.forEach(slot => {
        const slotFormName = `${formCodeCase(name)}_${formCodeCase(
          slot,
        )}_Load`

        const mesh = (formMesh[name] ??= {})
        mesh[slot] = slotFormName

        list.push(
          `export const ${slotFormName}: z.ZodType<Form.${formCodeCase(
            name,
          )}> = z.object({`,
        )

        for (const linkName in form.link) {
          const link = form.link[linkName]
          if (!link || link.list) {
            continue
          }

          const makeLinkName = link.site ? link.site.name : linkName

          const slotLoadName = `${formCodeCase(name)}_${formCodeCase(
            makeLinkName,
          )}_${formCodeCase(slot)}_Load`

          list.push(`${makeLinkName}: ${slotLoadName},`)
        }

        list.push(`})`)
        list.push(``)
      })
    } else {
      // 3. define the 4 transform types for each
      SLOT.forEach(slot => {
        const slotFormName = `Load.${formCodeCase(name)}`
        const mesh = (formMesh[name] ??= {})
        mesh[slot] = slotFormName
      })
    }
  }

  list.push(...makeFoot(base, formMesh))

  const text = await loveCode(list.join('\n'))

  return text
}
