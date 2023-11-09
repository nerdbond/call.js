import { FormCast } from '../form'

export type MakeHoldMoldCast = () => MakeHoldCast

export type MakeHoldCast = {
  have?: FormCast
  read?: string
}
