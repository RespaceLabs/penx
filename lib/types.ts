import { Address } from 'viem'

export type App = {
  id: string
  creator: string
  uri: string
  feeReceiver: string
  feePercent: string
  timestamp: string
}

export type SpaceType = SpaceOnChain & SpaceOnEvent & SpaceInfo

export type SpaceOnChain = {
  address: Address
  x: string
  y: string
  k: string
  uri: string
  name: string
  stakingRevenuePercent: string
  symbol: string
  totalSupply: string
}

export type SpaceOnEvent = {
  id: string
  spaceId: string
  address: Address
  founder: Address
  symbol: string
  name: string
  preBuyEthAmount: string
  ethVolume: string
  tokenVolume: string
  tradeCreatorFee: string
  uri: string
  memberCount: number
  members: Array<{
    id: string
    account: Address
  }>
}

export type SpaceInfo = {
  name: string
  description: string
  about: string
  logo: string
  subdomain: string
}

export type Plan = {
  uri: string
  price: bigint
  isActive: boolean
}

export type Contributor = {
  account: Address
  shares: bigint
  rewards: bigint
  checkpoint: bigint
}

export type Trade = {
  id: string
  account: string
  type: 'SELL' | 'BUY'
  tokenAmount: string
  ethAmount: string
  creatorFee: string
  protocolFee: string
  space: {
    id: string
    address: string
  }
}

export type Holder = {
  id: string
  account: string
  balance: bigint
  space: {
    id: string
    address: string
  }
}

export type SubscriptionRecord = {
  id: string
  planId: number
  type: 'SUBSCRIBE' | 'UNSUBSCRIBE'
  account: Address
  duration: bigint
  amount: bigint
  timestamp: bigint
  space: {
    id: string
    address: string
  }
}
