export type SeekHaveCast = {
  [key: string]: SeekHaveLinkCast
}

export type SeekHaveTestCast =
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

export type SeekHaveLinkCast = {
  like?: string
  need?: boolean
  test?: SeekHaveTestCast | Array<SeekHaveTestCast>
  link?: SeekHaveCast
}
