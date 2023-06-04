import CallBase from './call.js'
import FormBase from './form.js'
import ReadTakeBase from './take/read.js'
import SaveTakeBase from './take/save.js'

const base = {
  call: CallBase,
  form: FormBase,
  read: ReadTakeBase,
  save: SaveTakeBase,
}

type Base = typeof base

export type { Base }
export default base
