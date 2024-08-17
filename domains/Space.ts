import { Address } from 'viem'

export type SpaceRaw = {
  name: string
  symbol: string
  founder: Address
  x: bigint
  y: bigint
  k: bigint
  daoFees: bigint
  stakingFees: bigint
  subscriptionPrice: bigint
  subscriptionIncome: bigint
  totalStaked: bigint
  accumulatedRewardsPerToken: bigint
  totalShare: bigint
  accumulatedRewardsPerShare: bigint
}

export const FEE_RATE = BigInt(1) // 1%
export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days
export const SECONDS_PER_DAY = BigInt(24 * 60 * 60) // 1 days

export class Space {
  constructor(public raw: SpaceRaw) {}

  get x() {
    return this.raw.x
  }

  get y() {
    return this.raw.y
  }

  get k() {
    return this.raw.k
  }

  get subscriptionPrice() {
    return this.raw.subscriptionPrice
  }

  get symbolName() {
    return this.raw.symbol
  }

  /**
   * calculate the eth from subscription in a given duration
   * @param duration  duration by seconds
   * @returns
   */
  calEthByDuration(days: number | string) {
    const duration = BigInt(Number(days) * Number(SECONDS_PER_DAY))
    const tokenPricePerSecond = this.getEthPricePerSecond()
    return duration * tokenPricePerSecond
  }

  calTokenByDuration(days: number | string) {
    const duration = BigInt(Number(days) * Number(SECONDS_PER_DAY))
    const tokenPricePerSecond = this.getTokenPricePerSecond()
    return duration * tokenPricePerSecond
  }

  getEthPricePerSecond() {
    const ethPricePerSecond = this.subscriptionPrice / SECONDS_PER_MONTH
    return ethPricePerSecond
  }

  getTokenPricePerSecond() {
    const ethPricePerSecond = this.getEthPricePerSecond()
    const { tokenAmount } = this.getTokenAmount(ethPricePerSecond)
    return tokenAmount
  }

  getTokenAmount(ethAmount: bigint) {
    const fee = (ethAmount * FEE_RATE) / BigInt(100)
    const ethAmountAfterFee = ethAmount - fee
    const newX = this.x + ethAmountAfterFee
    const newY = this.k / newX
    const tokenAmount = this.y - newY
    return {
      tokenAmount,
    }
  }

  getEthAmount(tokenAmount: bigint) {
    const fee = (tokenAmount * FEE_RATE) / BigInt(100)
    const tokenAmountAfterFee = tokenAmount - fee
    const newY = this.y + tokenAmountAfterFee
    const newX = this.k / newY
    const ethAmount = this.x - newX
    return { ethAmount }
  }
}
