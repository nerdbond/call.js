import _ from 'lodash'
import path from 'path'
import prettier from 'prettier'
import { fileURLToPath } from 'url'

import { BaseForm, Base as FormBase } from '@tunebond/form.js'

import { Load, LoadRead } from './index.js'

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

export type Base = Record<string, Call>

export type Call = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load: (link: any) => Load
  read: LoadRead
}

export async function make(callBase: Base, base: FormBase) {
  const form = await makeForm(callBase, base)
  return form
}

export async function makeForm(callBase: Base, base: FormBase) {
  const text: Array<string> = []

  text.push(`export namespace Call {`)
  text.push(`export namespace Form {`)

  for (const callName in callBase) {
    const call = callBase[callName]

    text.push(`export type ${pascal(callName)} = {`)

    if (!call) {
      throw new Error(`No call ${callName}`)
    }

    for (const name in call.read) {
      const form = base[name]

      if (!form) {
        throw new Error(`No form ${name}`)
      }

      text.push(`${name}: {`)

      // if (_.isObject(call.read[name])) {
      //   makeRead(call.read[name], form)
      // }

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

  text.push(`}`)

  return await makeText(text.join('\n'))

  function makeRead(call: Record<string, unknown>, form: BaseForm) {}
}

export async function makeTest(callBase: Base, base: FormBase) {
  const text: Array<string> = []

  for (const callName in callBase) {
    const call = callBase[callName]

    text.push(`const ${pascal(callName)}Test: z.ZodType<> = z.object(`)

    if (!call) {
      throw new Error(`No call ${callName}`)
    }

    for (const name in call.read) {
      const form = base[name]

      if (!form) {
        throw new Error(`No form ${name}`)
      }
    }

    text.push(`)`)
  }
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
