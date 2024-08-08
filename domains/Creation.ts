import { precision } from '@/lib/math'
import { Address } from 'viem'

export type CreationRaw = {
  id: bigint
  creator: Address
  appId: bigint
  name: string
  uri: string
  farmer: number
  curve: number
  curveArgs: bigint[]
  balance: bigint
  volume: bigint
}
export class Creation {
  constructor(public raw: CreationRaw) {}

  get id() {
    return this.raw.id
  }

  get idDecimal() {
    return Number(this.id)
  }

  get idString() {
    return String(this.id)
  }

  get appId() {
    return this.raw.appId
  }

  get appIdDecimal() {
    return Number(this.appId)
  }

  get name() {
    return this.raw.name
  }

  get creator() {
    return this.raw.creator
  }

  get volume() {
    return this.raw.volume
  }

  get tvl() {
    return this.raw.balance
  }

  get tvlFormatted() {
    return precision.toDecimal(this.tvl, 6).toFixed(2)
  }
}
