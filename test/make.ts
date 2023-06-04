import path from 'path'
import form from '../form.js'

boot()

async function boot() {
  const headLink = path.resolve('./test/base/index.ts')
  const hostLink = path.resolve('./test/host')
  await form(headLink, hostLink)
}
