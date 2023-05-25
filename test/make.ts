import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import { fileURLToPath } from 'url'

import { make } from '../make.js'
import CallBase from './call.js'
import FormBase from './form.js'
import ReadBase from './read.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

start()

async function start() {
  const link = path.relative(
    path.resolve('./test/host'),
    path.join(__dirname, 'call.js'),
  )
  const base = {
    call: CallBase,
    form: FormBase,
    link,
    read: ReadBase,
  }
  const call = await make(CallBase, FormBase, ReadBase, link)
  fs.writeFileSync('./test/host/call.ts', call)
}
