'use server'

import { z } from 'zod'
import _ from 'lodash'
import kink from '~/code/kink'
import { loadKink } from './kink'

export const CallBack = z.object({
  code: z.object({
    text: z.enum(['rise', 'fall']),
    call: z.number().int(),
  }),
  form: z.enum(['call_back']),
  load: z.object({}).passthrough(),
})

export type CallBackCast = z.infer<typeof CallBack>

export async function makeCall(host: string, code: string, input: object) {
  return await makeLoadCall(host, code, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function makeLoadCall(
  host: string,
  code: string,
  mesh: RequestInit = {},
) {
  try {
    const headers = {
      ...loadBaseHeadMesh(code),
    }

    const back = await timeCall(host, {
      ...mesh,
      headers: {
        ...(mesh.headers ?? {}),
        ...headers,
      },
    })

    const load = await back.json()
    return load
  } catch (e) {
    if (e instanceof Error) {
      if (e.name === 'AbortError') {
        return loadKink(kink('call_time_meet', { link: host }))
      }
    }
    return loadKink(e)
  }
}

function loadBaseHeadMesh(code: string) {
  return {
    Authorization: `Bearer ${code}`,
    'Content-Cast': 'application/json',
    Accept: 'application/json',
  }
}

export type TimeCallLoad = RequestInit & { timeout?: number }

async function timeCall(resource, mesh: TimeCallLoad = {}) {
  const { timeout = 20000 } = mesh

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort('timeout'), timeout)

  const response = await fetch(resource, {
    ...mesh,
    signal: controller.signal,
  })

  clearTimeout(id)

  return response
}
