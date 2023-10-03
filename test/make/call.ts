// import { dirname } from 'path'
// import { fileURLToPath } from 'url'
// import fs from 'fs'
// import handle from '~/code/make/call'
// import base from '~/code/type/base'
// import extendBase from '~/code/type/source/extend'
// import manageBase from '~/code/type/source/manage'

// const only = process.argv[2]

// const __dirname = dirname(fileURLToPath(import.meta.url))

// handleEach()

// async function handleEach() {
//   for (const name in base) {
//     if (only && name !== only) {
//       continue
//     }

//     const extend = extendBase[name]
//     const manage = manageBase[name]

//     if (extend && manage) {
//       console.log(`Starting extend and manage '${name}'`)
//     } else if (extend) {
//       console.log(`Starting extend '${name}'`)
//     } else if (manage) {
//       console.log(`Starting manage '${name}'`)
//     } else {
//       console.log(`No extend or manage for '${name}'`)
//       continue
//     }

//     const { parser, type } = await handle({
//       base,
//       name,
//       extend,
//       manage,
//     })

//     fs.mkdirSync(`${__dirname}/../code/type/call/${name}`, {
//       recursive: true,
//     })
//     fs.writeFileSync(
//       `${__dirname}/../code/type/call/${name}/index.ts`,
//       type,
//     )
//     fs.writeFileSync(
//       `${__dirname}/../code/type/call/${name}/parser.ts`,
//       parser,
//     )
//   }
// }
