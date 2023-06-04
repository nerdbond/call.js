import fs from 'fs'
import path from 'path'

import type { Base } from './index.js'
import { make } from './make.js'
import { haveText } from '@tunebond/have'

const head = process.argv[2]
const host = process.argv[3]

haveText(head, 'head')
haveText(host, 'host')

boot(head, host)

async function boot(headLink: string, hostLink: string) {
  fs.mkdirSync(hostLink, { recursive: true })

  const base = (await load(headLink)) as Base
  const siteHeadLink = path.relative(hostLink, headLink)
  const code = await make(base.call, base.form, base.read, siteHeadLink)
  save(path.join(hostLink, './index.ts'), code)
}

async function load(card: string) {
  return (await import(card)) as unknown
}

function save(link: string, code: string) {
  fs.writeFileSync(link, code)
}
