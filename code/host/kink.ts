import Kink, { KinkList } from '@termsurf/kink'
import { z } from 'zod'
import _ from 'lodash'
import kink from '~/code/kink'

export function isZodError<I>(
  input: any,
): input is z.SafeParseError<I> {
  return !input.success && 'error' in input
}

export type KinkBack = {
  like: 'kink'
  code?: {
    call: number
  }
  load: Array<any> | any
}

export function loadZodErrorJSON(error: z.ZodError) {
  const back: KinkBack = {
    code: {
      call: 406,
    },
    like: 'kink',
    load: error.issues.map(error => {
      switch (error.code) {
        case z.ZodIssueCode.invalid_type:
          return kink('form_fail', _.omit(error, ['code'])).toJSON()
        case z.ZodIssueCode.unrecognized_keys:
          return kink(
            'form_link_fail',
            _.omit(error, ['code']),
          ).toJSON()
        default:
          return Kink.makeBase({ name: 'z.ZodError', ...error })
      }
    }),
  }

  return back
}

export function loadKink(error: any) {
  const back: KinkBack = loadKinkList(error)

  if (back.load.length === 1) {
    back.load = back.load[0]
  }

  return back
}

export function loadKinkList(error: any) {
  if (error instanceof z.ZodError) {
    return loadZodErrorJSON(error)
  } else {
    let back: KinkBack
    let code
    if (error instanceof KinkList) {
      back = {
        like: 'kink',
        load: error.list.map(error => {
          Kink.saveFill(error)
          code ??= error.siteCode
          return error.toJSON()
        }),
      }
    } else if (error instanceof Kink) {
      Kink.saveFill(error)
      code ??= error.siteCode
      back = { like: 'kink', load: [error.toJSON()] }
    } else if (error instanceof Error) {
      code ??= 500
      back = { like: 'kink', load: [Kink.makeBase(error)] }
    } else {
      code ??= 500
      back = {
        like: 'kink',
        load: [Kink.makeBase(new Error(error))],
      }
    }
    return {
      code: {
        call: code ?? 500,
      },
      ...back,
    }
  }
}

// process.on('uncaughtException', kink => {
//   console.log(``)
//   if (kink instanceof KinkList) {
//     if (kink.list.length === 1) {
//       const k = kink.list[0]
//       if (k) {
//         Kink.saveFill(k)
//         console.log(makeKinkText(k))
//       }
//     } else {
//       console.log(makeKinkText(kink))
//       kink.list.forEach(kink => {
//         console.log(``)
//         Kink.saveFill(kink)
//         console.log(makeKinkText(kink))
//       })
//     }
//   } else if (kink instanceof Kink) {
//     Kink.saveFill(kink)
//     console.log(makeKinkText(kink))
//   } else if (kink instanceof Error) {
//     console.log(makeBaseKinkText(kink))
//   } else {
//     console.log(kink)
//   }
//   console.log(``)
// })
