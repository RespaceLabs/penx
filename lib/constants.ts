import { Address } from 'viem'

export const isServer = typeof window === 'undefined'
export const isBrowser = typeof window !== 'undefined'
export const isProd = process.env.NODE_ENV === 'production'

// GOOGLE|REOWN|PRIVY
export const AUTH_TYPE = process.env.NEXT_PUBLIC_AUTH_TYPE! || 'GOOGLE'

export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!
export const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!

export const isPrivy = AUTH_TYPE === 'PRIVY'
export const isGoogleOauth = AUTH_TYPE === 'GOOGLE'

export const GOOGLE_OAUTH_REDIRECT_URI =
  'https://www.plantree.xyz/api/google-oauth'

export const GOOGLE_DRIVE_OAUTH_REDIRECT_URI =
  'https://www.plantree.xyz/api/google-drive-oauth'

export const REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL =
  'https://www.plantree.xyz/api/refresh-google-drive-token'

export const GOOGLE_CLIENT_ID =
  '864679274232-niev1df1dak216q5natclfvg5fhtp7fg.apps.googleusercontent.com'

export const PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID || '3d31c4aa12acd88d0b8cad38b0a5686a'

export const GOOGLE_DRIVE_FOLDER_PREFIX = `plantree-${process.env.NEXT_PUBLIC_SPACE_ID}`

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
