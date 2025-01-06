import { Address } from 'viem'

export * from './schema-types'
export * from './database-types'

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

export type Creation = {
  id: string
  creationId: string
  creator: Address
  space: Address
  mintedAmount: string
}

export type MintRecord = {
  id: string
  creationId: string
  minter: Address
  curator: Address
  amount: string
  price: string
}

export type TipRecord = {
  id: string
  tipper: Address
  receiver: Address
  amount: string
  uri: string
  tipperRewardPercent: string
}

export type GoogleInfo = {
  access_token: string
  scope: string
  token_type: string
  expiry_date: number
  refresh_token: string

  id: string
  email: string
  picture: string
}

export type Socials = {
  farcaster: string
  x: string
  mastodon: string
  github: string
  facebook: string
  youtube: string
  linkedin: string
  threads: string
  instagram: string
  medium: string
}

export type SubscriptionRaw = {
  planId: number
  account: string
  startTime: bigint
  duration: bigint
  amount: bigint
  uri: string
}

export type SubscriptionInSession = {
  planId: number
  startTime: number
  duration: number
}

export type AccountWithUser = any
// export type AccountWithUser = Account & {
//   user: User
// }

export interface FilterItem {
  label: string
  value: string | number
  selected?: boolean
}

export interface ICommandItem {
  keywords: string[]
  data: {
    type: 'Database' | 'Command' | 'Application'
    alias: string
    database: any
    assets: Record<string, string>
    filters: Record<string, FilterItem[]>
    runtime: 'worker' | 'iframe'
    commandName: string
    extensionSlug: string
    extensionIcon: string
    isDeveloping: boolean

    applicationPath: string
    isApplication: boolean
    appIconPath?: string
  }
}
