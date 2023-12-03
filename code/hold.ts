export default class Hold {
  load: (code: Array<any>) => Promise<Array<any>>

  base: Record<string, any>

  constructor(load) {
    this.load = load
    this.base = {}
  }

  async read(code: Array<any>) {
    const holdList: Array<any> = []
    const restCode: Array<any> = []

    for (const slotCode of code) {
      const holdSite = this.base[slotCode]
      if (holdSite) {
        holdList.push(holdSite)
      } else {
        restCode.push(slotCode)
      }
    }

    if (restCode.length) {
      const list = await this.load(restCode)

      if (list.length !== restCode.length) {
        throw new Error()
      }

      list.forEach((site, slot) => {
        const slotCode = restCode[slot]
        if (slotCode && site) {
          this.base[slotCode] = site
        }
      })
    }
  }
}
