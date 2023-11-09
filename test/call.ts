// import { dirname } from 'path'
// import { fileURLToPath } from 'url'
// import fs from 'fs'
// import handle from '~/code/make/query'
// import base from '~/code/type/base'

// const __dirname = dirname(fileURLToPath(import.meta.url))

// start()

// async function start() {
//   const { type, parser } = await handle({
//     base,
//     query: {
//       gatherLanguage: () => ({
//         object: 'language',
//         action: 'gather',
//         extend: {
//           id: true,
//           slug: true,
//           flow: {
//             total: true,
//             extend: {
//               slug: true,
//             },
//           },
//         },
//       }),
//       gatherScript: () => ({
//         object: 'script',
//         action: 'select',
//         extend: {
//           id: true,
//           slug: true,
//         },
//       }),
//     },
//   })

//   fs.mkdirSync(`${__dirname}/../tmp/query`, { recursive: true })
//   fs.writeFileSync(`${__dirname}/../tmp/query/index.ts`, type)
//   fs.writeFileSync(`${__dirname}/../tmp/query/parser.ts`, parser)
// }
