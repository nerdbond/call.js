import fs from 'fs'
import path from 'path'

import type { Base } from './base.js'
import make from './make/take/index.js'

export default async function form(headLink: string, hostLink: string) {
  fs.mkdirSync(hostLink, { recursive: true })

  const base = (await load(headLink)) as Base
  const siteHeadLink = path.relative(hostLink, headLink)
  const head = await make(base, siteHeadLink)

  fs.mkdirSync(`${hostLink}/back`, { recursive: true })
  fs.mkdirSync(`${hostLink}/site`, { recursive: true })
  fs.mkdirSync(`${hostLink}/face`, { recursive: true })
  fs.mkdirSync(`${hostLink}/call`, { recursive: true })
  fs.mkdirSync(`${hostLink}/form`, { recursive: true })

  fs.mkdirSync(`${hostLink}/site/read`, { recursive: true })
  fs.mkdirSync(`${hostLink}/face/read`, { recursive: true })

  fs.mkdirSync(`${hostLink}/site/save`, { recursive: true })
  fs.mkdirSync(`${hostLink}/face/save`, { recursive: true })

  fs.writeFileSync(`${hostLink}/call/form.ts`, move(head.call.form, 3))
  fs.writeFileSync(`${hostLink}/call/load.ts`, move(head.call.load, 3))

  fs.writeFileSync(`${hostLink}/form/form.ts`, move(head.form.form, 3))
  fs.writeFileSync(`${hostLink}/form/load.ts`, move(head.form.load, 3))

  fs.writeFileSync(`${hostLink}/back/form.ts`, move(head.back.form, 3))
  fs.writeFileSync(`${hostLink}/back/load.ts`, move(head.back.load, 3))

  // fs.writeFileSync(`${hostLink}/site/read/form.ts`, head.site.read.form)
  // fs.writeFileSync(`${hostLink}/site/read/load.ts`, head.site.read.load)
  // fs.writeFileSync(`${hostLink}/site/save/form.ts`, head.site.save.form)
  // fs.writeFileSync(`${hostLink}/site/save/load.ts`, head.site.save.load)

  // fs.writeFileSync(`${hostLink}/face/read/form.ts`, head.face.read.form)
  // fs.writeFileSync(`${hostLink}/face/read/load.ts`, head.face.read.load)
  // fs.writeFileSync(`${hostLink}/face/save/form.ts`, head.face.save.form)
  // fs.writeFileSync(`${hostLink}/face/save/load.ts`, head.face.save.load)
}

async function load(card: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (await import(card)).default as unknown
}

function move(code: string, size = 1) {
  if (process.env.TEST_CALL) {
    const list = new Array(size).fill('..').join('/')
    return code.replace(/@tunebond\/call/g, `${list}/index.js`)
  }
  return code
}
