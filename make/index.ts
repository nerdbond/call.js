export type BondHaltRest = {
  link?: Link<HaltBase, HaltBaseName>
  test: (bond: unknown, link: Record<string, unknown>) => boolean
  line?: Array<string>
}

export function bondHalt(
  form: HaltBaseName,
  lead: unknown,
  bind: RefinementCtx,
  { link = {}, test, line }: BondHaltRest,
) {
  const rise = test(lead, link)

  if (!rise) {
    const { note, ...bond } = halt(form, link).toJSON()

    bind.addIssue({
      code: z.ZodIssueCode.custom,
      message: note,
      path: line,
      params: {
        halt: true,
        bond: {
          ...bond,
          lead,
        },
      },
    })
  }

  return rise
}

export function testHave(lead: unknown) {
  return lead != null
}

type TestTakeRest = {
  take: Array<unknown>
}

export function testTake(lead: unknown, { take }: TestTakeRest) {
  return take.includes(lead)
}
