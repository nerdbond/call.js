import { Base } from '../../make/take/index.js'
import makeFace from './face.js'
import makeBack from './back.js'
import makeSite from './site.js'
import makeCall from './call.js'
import makeForm from './form.js'
import _ from 'lodash'

export default async function make(base: Base, link: string) {
  const baseLink = link.replace(/\.ts$/, '.js')
  const face = await makeFace(base)
  const back = await makeBack(base, baseLink)
  const site = await makeSite(base)
  const call = await makeCall(base, baseLink)
  const form = await makeForm(base, baseLink)
  return { back, call, face, form, site }
}
