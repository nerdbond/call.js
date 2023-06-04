import fs from 'fs'
import path from 'path'
import { haveText } from '@tunebond/have'

import form from './form.js'

const head = process.argv[2]
const host = process.argv[3]

haveText(head, 'head')
haveText(host, 'host')

form(head, host)
