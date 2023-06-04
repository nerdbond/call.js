import { exec } from 'child_process'
import chokidar from 'chokidar'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

type Boot = {
  base: string
  head: string
  host: string
}

export default function boot({ base, head, host }: Boot) {
  const siteLink = process.cwd()
  const baseLink = base ?? path.join(siteLink, './schemas/**/*.ts')
  const headLink =
    head ?? path.join(siteLink, './schemas/base/index.ts')
  const hostLink = host ?? path.join(siteLink, './schemas/host')

  const scan = chokidar.watch(baseLink)

  console.log(`  scanning ${baseLink}`)

  scan.on('add', makeBase).on('change', makeBase).on('unlink', makeBase)

  async function makeBase(file: string) {
    console.log(`  changed ${file}`)

    // console.log(`changed ${file}`)
    const formLink = path.join(__dirname, '../form.ts')
    const baseLink = path.join(__dirname, '../tsconfig.lib.json')

    // for tmp files
    const holdLink = path.join(__dirname, '../hold')
    if (!fs.existsSync(holdLink)) {
      fs.mkdirSync(holdLink, { recursive: true })
    }

    const tool = `npx ts-node-esm -P ${baseLink} ${formLink} "${headLink}" "${hostLink}"`

    exec(tool).on('error', halt => {
      console.log(halt)
    })
  }
}
