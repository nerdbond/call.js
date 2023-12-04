import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import make from '~/make'
import seed from '~/test/seed/take'
import { MakeTakeCast } from '~/make/cast'

const __dirname = dirname(fileURLToPath(import.meta.url))

// const

make_file_list()

async function make_file_list() {
  const take: MakeTakeCast = {
    ...seed,
  }
  const { tree } = await make(take)
  fs.mkdirSync(`${__dirname}/../tmp/tree`, { recursive: true })
  fs.writeFileSync(`${__dirname}/../tmp/tree/cast.ts`, tree.cast)
  fs.writeFileSync(`${__dirname}/../tmp/tree/take.ts`, tree.take)
}
