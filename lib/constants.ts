export const isServer = typeof window === 'undefined'
export const isBrowser = typeof window !== 'undefined'
export const isProd = process.env.NODE_ENV === 'production'

export const GOOGLE_OAUTH_REDIRECT_URI =
  'https://www.plantree.xyz/api/google-oauth'

export const IPFS_UPLOAD_URL = 'https://www.plantree.xyz/api/ipfs-upload'
export const IPFS_GATEWAY = 'https://ipfs-gateway.spaceprotocol.xyz'

export const GOOGLE_DRIVE_OAUTH_REDIRECT_URI =
  'https://www.plantree.xyz/api/google-drive-oauth'

export const REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL =
  'https://www.plantree.xyz/api/refresh-google-drive-token'

export const GOOGLE_CLIENT_ID =
  '864679274232-niev1df1dak216q5natclfvg5fhtp7fg.apps.googleusercontent.com'

export const PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID || '3d31c4aa12acd88d0b8cad38b0a5686a'

export const GOOGLE_DRIVE_FOLDER_PREFIX = `plantree-`

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
  ARB_SEPOLIA = 'ARB_SEPOLIA',
  BASE_SEPOLIA = 'BASE_SEPOLIA',
  BASE = 'BASE',
}

export const NETWORK =
  (process.env.NEXT_PUBLIC_NETWORK as NetworkNames) || NetworkNames.BASE

export enum WorkerEvents {
  START_POLLING,
}

export const RESPACE_BASE_URI = 'https://www.respace.one'

export const SUBGRAPH_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://gateway.thegraph.com/api/c2921e95d896043ce3602d19cbbedcd2/subgraphs/id/CU3uKSKPmb5UP2imvySrJSHpU5DDnfpV5TdjWqbeZ85M'
    : 'https://api.studio.thegraph.com/query/88544/respace-base-sepolia/version/latest'
