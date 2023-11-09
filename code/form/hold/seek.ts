export type SeekHoldCast = {
  [key: string]: SeekHoldLinkCast
}

export type SeekHoldTestCast =
  | '>='
  | '>'
  | '<='
  | '<'
  | 'start'
  | 'end'
  | 'match'
  | '='
  | '!='
  | 'in'

export type SeekHoldLinkCast = {
  like?: string
  need?: boolean
  test?: SeekHoldTestCast | Array<SeekHoldTestCast>
  link?: SeekHoldLinkCast
}
