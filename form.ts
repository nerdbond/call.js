import fs from 'fs'
import path from 'path'

import type { Base } from './index.js'
import { make } from './make.js'

boot(process.argv[2] as string, process.argv[3] as string)

async function boot(headLink: string, hostLink: string) {
  fs.mkdirSync(hostLink, { recursive: true })

  const base = (await load(headLink)) as Base
  const code = await make(base.call, base.form, base.read, headLink)
  save(path.join(hostLink, './index.ts'), code)
}

async function load(card: string) {
  return (await import(card)) as unknown
}

function save(link: string, code: string) {
  fs.writeFileSync(link, code)
}
