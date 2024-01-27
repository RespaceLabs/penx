import { div, precision, times } from '@penx/math'

interface TokenInfoRaw {
  maxSupply: bigint
  currentSupply: bigint
  currentPrice: bigint
  maxPrice: bigint
  minPrice: bigint
}

export class BelieverNFT {
  constructor(public raw: TokenInfoRaw) {}

  get maxSupplyDecimal() {
    return Number(this.raw.maxSupply)
  }

  get currentSupplyDecimal() {
    return Number(this.raw.currentSupply)
  }

  get currentPrice() {
    return this.raw.currentPrice
  }

  get currentPriceDecimal() {
    return precision.toTokenDecimal(this.raw.currentPrice)
  }

  get minPriceDecimal() {
    return precision.toTokenDecimal(this.raw.minPrice)
  }

  get maxPriceDecimal() {
    return precision.toTokenDecimal(this.raw.maxPrice)
  }

  get percentFormatted() {
    return (
      times(div(this.currentSupplyDecimal, this.maxSupplyDecimal), 100) + '%'
    )
  }
}
