/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod'
import base from '../../base/index.js'
import { testText } from '@tunebond/have'
const load = {
  Email: z.custom<'email'>((bond: unknown) => {
    return testText(bond) && base.form.email.test(bond)
  }),
  Code: z.custom<'code'>((bond: unknown) => {
    return testText(bond) && base.form.code.test(bond)
  }),
}
export default load
