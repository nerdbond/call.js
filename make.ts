import _ from 'lodash'
import path from 'path'
import prettier from 'prettier'
import { fileURLToPath } from 'url'

import type {
  BaseForm,
  BaseFormLink,
  Base as FormBase,
} from '@tunebond/form'

import { CallBase, LoadRead, LoadReadLink, ReadBase } from './index.js'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const PRETTIER = {
  arrowParens: 'avoid' as const,
  bracketSpacing: true,
  endOfLine: 'lf' as const,
  importOrder: [
    '^\\w(.*)$',
    '^@(.*)$',
    '~(.*)$',
    '\\..(.*)$',
    '\\.(.*)$',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  printWidth: 72,
  proseWrap: 'always' as const,
  quoteProps: 'as-needed' as const,
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all' as const,
  useTabs: false,
}

const ESLINT = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest' as const,
    project: [`${__dirname}/tsconfig.json`],
    sourceType: 'module' as const,
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'typescript-sort-keys',
    'sort-keys',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/array-type': [
      2,
      {
        default: 'generic',
      },
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/consistent-type-definitions': [2, 'type'],
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/lines-between-class-members': 'error',
    '@typescript-eslint/method-signature-style': 'error',
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-throw-literal': 'error',
    '@typescript-eslint/no-unnecessary-condition': 0,
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-useless-empty-export': 'error',
    '@typescript-eslint/object-curly-spacing': [2, 'always'],
    '@typescript-eslint/padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        next: ['type'],
        prev: '*',
      },
    ],
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    '@typescript-eslint/space-before-blocks': ['error', 'always'],
    '@typescript-eslint/type-annotation-spacing': [
      'error',
      { after: true },
    ],
    curly: 2,
    'default-case': 'error',
    'default-case-last': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'lines-between-class-members': 'off',
    'no-array-constructor': 'off',
    'no-throw-literal': 'off',
    'object-curly-spacing': 'off',
    'padding-line-between-statements': 'off',
    'prettier/prettier': 2,
    'sort-keys': 0,
    'sort-keys/sort-keys-fix': 2,
    'space-before-blocks': 'off',
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
  },
}

export async function make(
  callBase: CallBase,
  formBase: FormBase,
  readBase: ReadBase,
  callLink: string,
) {
  const form = await makeForm(callBase, formBase, readBase, callLink)
  return form
}

export async function makeForm(
  callBase: CallBase,
  formBase: FormBase,
  readBase: ReadBase,
  callLink: string,
) {
  const text: Array<string> = []

  text.push(`import fetch from 'cross-fetch'`)
  text.push(`import CallBase from '${callLink}'`)

  text.push(`export namespace Call {`)
  text.push(`export namespace Form {`)

  for (const callName in callBase) {
    const call = callBase[callName]
    testMesh(call)

    text.push(`export type ${pascal(callName)} = {`)

    for (const name in call.read) {
      const read = readBase[name]
      const form = formBase[name]
      testMesh(read)
      testMesh(form)

      const load = call.read[name]
      testMesh(load)

      text.push(`${name}: {`)

      makeRead(load, form, read)

      text.push(`}`)
    }

    text.push(`}`)
  }

  text.push(`}`)

  text.push(`export type Base = {`)

  for (const callName in callBase) {
    text.push(`${callName}: Form.${pascal(callName)}`)
  }

  text.push(`}`)

  text.push(`export type Name = keyof Base`)

  text.push(`}`)

  text.push(
    `export default async function call<Name extends Call.Name>(host: string, name: Name, link: Parameters<CallBase[Name]['load']>[0]) {`,
  )

  text.push(`const call = CallBase[name]`)
  text.push(`const loadBase = await call.load(link)`)
  text.push(`const callHead = await fetch(host, {`)
  text.push(`  method: 'PATCH',`)
  text.push(`  headers: {`)
  text.push(`    'Content-Type': 'application/json',`)
  text.push(`    Accept: 'application/json'`)
  text.push(`  },`)
  text.push(`  body: JSON.stringify(loadBase)`)
  text.push(`})`)
  text.push(`if (callHead.status >= 400) {`)
  text.push(`  throw new Error(\`Status \${callHead.status}\`)`)
  text.push(`}`)
  text.push(`const loadHead = await callHead.json()`)
  text.push(`return loadHead`)

  text.push(`}`)

  return await makeText(text.join('\n'))

  function makeRead(
    call: LoadReadLink,
    form: BaseForm,
    read: LoadReadLink,
  ) {
    for (const name in call.read) {
      const formLink = form.link[name]
      const callLink = call.read[name]

      testMesh(formLink)

      let readLink

      if (read.list) {
        testMesh(read.read.list)
        readLink = read.read.list.read[name]
      } else {
        readLink = read.read[name]
      }

      if (callLink === true) {
        const nullable = formLink.void ? '?' : ''
        switch (formLink.form) {
          case 'text':
          case 'code':
          case 'uuid':
            testWave(readLink)
            text.push(`${name}${nullable}: string`)
            break
          case 'date':
            testWave(readLink)
            text.push(`${name}${nullable}: string`)
            break
          case 'mark':
            testWave(readLink)
            text.push(`${name}${nullable}: number`)
            break
          case 'wave':
            testWave(readLink)
            text.push(`${name}${nullable}: boolean`)
            break
          default:
            throw new Error(String(formLink.form))
            break
        }
      } else {
        testMesh(callLink)
        testMesh(readLink)
        if (callLink.list) {
          text.push(`${name}: {`)
          makeReadList(callLink.read, formLink, readLink.read)
          text.push(`}`)
        } else {
          const nullable = formLink.void ? '?' : ''
          text.push(`${name}${nullable}: {`)
          testText(formLink.form)
          const form = formBase[formLink.form]
          testMesh(form)
          makeRead(callLink, form, readLink)
          text.push(`}`)
          // makeReadMesh(formLink, readLink)
        }
      }
    }
  }

  function makeReadList(
    call: LoadRead,
    link: BaseFormLink,
    read: LoadRead,
  ) {
    if (call.size) {
      testWave(read.size)
      text.push(`size: number`)
    }

    if (call.list) {
      testMesh(read.list)
      text.push(`list: Array<{`)
      testText(link.form)
      const form = formBase[link.form]
      testMesh(form)
      testMesh(call.list)
      makeRead(call.list, form, read.list)
      text.push(`}>`)
    }
  }
}

// write a function to build a zod string from a form base
export async function makeTest(callBase: CallBase, formBase: FormBase) {
  const text: Array<string> = []

  for (const callName in callBase) {
    const call = callBase[callName]

    text.push(`const ${pascal(callName)}Test: z.ZodType<> = z.object(`)

    if (!call) {
      throw new Error(`No call ${callName}`)
    }

    for (const name in call.read) {
      const form = formBase[name]

      if (!form) {
        throw new Error(`No form ${name}`)
      }
    }

    text.push(`)`)
  }
}

export function seekMesh(x: unknown): x is Record<string, unknown> {
  return _.isObject(x)
}

export async function test(read: LoadRead, base: FormBase) {
  for (const formName in read) {
    if (!base.hasOwnProperty(formName)) {
      throw new Error(`Base missing ${formName}`)
    }

    const baseForm = base[formName]
    const readForm = read[formName]

    if (!_.isObject(readForm) || !_.isObject(baseForm)) {
      throw new Error()
    }

    if (!('list' in readForm) || !_.isObject(readForm.list)) {
      throw new Error()
    }

    // for (const linkName in readForm.list) {
    //   if (!baseForm.link.hasOwnProperty(linkName)) {
    //     throw new Error(`Base ${formName} missing ${linkName}`)
    //   }

    //   const baseFormLink = baseForm.link[linkName]
    //   const readLink = readForm.list[linkName]

    //   if (readLink === true) {
    //     continue
    //   }

    //   if (!_.isObject(readLink)) {
    //   }
    // }
  }
}

function testBond(x: unknown): asserts x {
  if (x == null) {
    throw new Error()
  }
}

function testWave(x: unknown): asserts x is boolean {
  if (!_.isBoolean(x)) {
    console.log(x)
    throw new Error()
  }
}

export function testMesh(
  x: unknown,
): asserts x is Record<string, unknown> {
  if (!seekMesh(x)) {
    throw new Error()
  }
}

export function testText(x: unknown): asserts x is string {
  if (!_.isString(x)) {
    throw new Error()
  }
}

function pascal(text: string) {
  return _.startCase(_.camelCase(text)).replace(/ /g, '')
}

async function makeText(text: string) {
  // const config = {
  //   eslintConfig: ESLINT,
  //   prettierOptions: PRETTIER,
  //   text: text,
  // }
  // // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  // return (await format(config)) as string
  return prettier.format(text, {
    ...PRETTIER,
    parser: 'typescript',
  })
}
