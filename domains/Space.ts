import { precision } from '@/lib/math'
import { Address } from 'viem'
import { bigint } from 'zod'

export type SpaceRaw = {
  name: string
  symbol: string
  founder: Address
  x: bigint
  y: bigint
  k: bigint
  insuranceEthAmount: bigint
  insuranceTokenAmount: bigint
  daoFee: bigint
  stakingFee: bigint
  subscriptionIncome: bigint
  totalStaked: bigint
  accumulatedRewardsPerToken: bigint
  totalShare: bigint
  accumulatedRewardsPerShare: bigint
}

export type PlanRaw = {
  uri: string
  price: bigint
  isActive: boolean
}

export const FEE_RATE = BigInt(1) // 1%
export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days
export const SECONDS_PER_DAY = BigInt(24 * 60 * 60) // 1 days

export class Space {
  constructor(
    public spaceRaw: SpaceRaw,
    public planRaw: PlanRaw,
  ) {}

  get x() {
    return this.spaceRaw.x
  }

  get y() {
    return this.spaceRaw.y
  }

  get k() {
    return this.spaceRaw.k
  }

  get subscriptionPrice() {
    return this.planRaw.price
  }

  get subscriptionPriceDecimal() {
    return precision.toDecimal(this.subscriptionPrice)
  }

  get symbolName() {
    return this.spaceRaw.symbol
  }

  getUsdPrice(ethPrice: number) {
    return ethPrice * this.subscriptionPriceDecimal
  }

  /**
   * calculate the eth from subscription in a given duration
   * @param duration  duration by seconds
   * @returns
   */
  calEthByDuration(days: number | string) {
    const duration = BigInt(
      parseInt((Number(days) * Number(SECONDS_PER_DAY)).toString()),
    )
    const tokenPricePerSecond = this.getEthPricePerSecond()
    return duration * tokenPricePerSecond
  }

  calTokenByDuration(days: number | string) {
    const duration = BigInt(Number(days) * Number(SECONDS_PER_DAY))
    const tokenPricePerSecond = this.getTokenPricePerSecond()
    return duration * tokenPricePerSecond
  }

  getEthPricePerSecond() {
    console.log('========this.subscriptionPrice:', this.subscriptionPrice)

    const ethPricePerSecond = this.subscriptionPrice / SECONDS_PER_MONTH
    return ethPricePerSecond
  }

  getTokenPricePerSecond() {
    const ethPricePerSecond = this.getEthPricePerSecond()
    const tokenAmount = this.getTokenAmount(ethPricePerSecond)
    return tokenAmount
  }

  getTokenAmount(ethAmount: bigint) {
    const fee = (ethAmount * FEE_RATE) / BigInt(100)
    const ethAmountAfterFee = ethAmount - fee
    const newX = this.x + ethAmountAfterFee
    const newY = this.k / newX
    const tokenAmount = this.y - newY
    return tokenAmount
  }

  getEthAmount(tokenAmount: bigint) {
    const fee = (tokenAmount * FEE_RATE) / BigInt(100)
    const tokenAmountAfterFee = tokenAmount - fee
    const newY = this.y + tokenAmountAfterFee
    const newX = this.k / newY
    const ethAmount = this.x - newX
    return ethAmount
  }
}
