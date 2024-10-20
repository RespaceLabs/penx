import { Address } from 'viem'

export const isServer = typeof window === 'undefined'
export const isBrowser = typeof window !== 'undefined'
export const isProd = process.env.NODE_ENV === 'production'

export const PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID || '3d31c4aa12acd88d0b8cad38b0a5686a'

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum SubscriptionType {
  SUBSCRIBE = 'SUBSCRIBE',
  UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export enum TradeSource {
  MEMBER = 'MEMBER',
  SPONSOR = 'SPONSOR',
  HOLDER = 'HOLDER',
}

export const SELECTED_SPACE = 'SELECTED_SPACE'

export enum PostType {
  ARTICLE = 'ARTICLE',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  NFT = 'NFT',
  FIGMA = 'FIGMA',
}

export enum GateType {
  FREE = 'FREE',
  PAID = 'PAID',
}

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export enum NetworkNames {
  MAINNET = 'MAINNET',
  DEVELOP = 'DEVELOP',
  SEPOLIA = 'SEPOLIA',
  ARB_SEPOLIA = 'ARB_SEPOLIA',
  BASE_SEPOLIA = 'BASE_SEPOLIA',
}

export enum WorkerEvents {
  START_POLLING,
}

export const SPACE_ID = process.env.NEXT_PUBLIC_SPACE_ID as Address

export const RESPACE_BASE_URI = 'https://www.respace.one'

export const SUBGRAPH_URL =
  'https://api.studio.thegraph.com/query/88544/respace-base-sepolia/version/latest'
