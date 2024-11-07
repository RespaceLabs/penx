export const IPFS_GATEWAY = 'https://ipfs-gateway.spaceprotocol.xyz'

export const SECONDS_PER_MONTH = BigInt(24 * 60 * 60 * 30) // 30 days
export const SECONDS_PER_DAY = BigInt(24 * 60 * 60) // 1 days

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum SubscriptionType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export const editorDefaultValue = [
  {
    type: 'p',
    children: [{ text: '' }],
  },
]
