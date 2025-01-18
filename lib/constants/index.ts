export * from './element-type'
export * from './defaultPostContent'

export const isServer = typeof window === 'undefined'
export const isBrowser = typeof window !== 'undefined'
export const isProd = process.env.NODE_ENV === 'production'
export const isNavigator = typeof navigator !== 'undefined'

export const GOOGLE_OAUTH_REDIRECT_URI = 'https://www.penx.io/api/google-oauth'
// export const GOOGLE_OAUTH_REDIRECT_URI = 'http://localhost:4000/api/google-oauth'
export const LINK_GOOGLE_ACCOUNT_REDIRECT_URI =
  'https://www.penx.io/api/link-google-account-oauth'
// 'http://localhost:4000/api/link-google-account-oauth'

export const STATIC_URL = 'https://static.penx.me'

export const IPFS_UPLOAD_URL = 'https://penx.io/api/ipfs-upload'
export const IPFS_ADD_URL = 'https://penx.io/api/ipfs-add'
// export const IPFS_ADD_URL = 'http://localhost:4000/api/ipfs-add'
export const IPFS_GATEWAY = 'https://ipfs-gateway.spaceprotocol.xyz'

export const ELECTRIC_BASE_URL = 'http://43.154.135.183:3000'

export const GOOGLE_DRIVE_OAUTH_REDIRECT_URI =
  'https://www.penx.io/api/google-drive-oauth'

export const REFRESH_GOOGLE_DRIVE_OAUTH_TOKEN_URL =
  'https://www.penx.io/api/refresh-google-drive-token'

export const GOOGLE_CLIENT_ID =
  '864679274232-niev1df1dak216q5natclfvg5fhtp7fg.apps.googleusercontent.com'

export const PROJECT_ID =
  process.env.NEXT_PUBLIC_PROJECT_ID || '3d31c4aa12acd88d0b8cad38b0a5686a'

export const GOOGLE_DRIVE_FOLDER_PREFIX = `penx-`
export const GOOGLE_DRIVE_FOLDER = 'penx'

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

  START_PULL,
  PULL_SUCCEEDED,
  PULL_FAILED,
}

export const RESPACE_BASE_URI =
  NETWORK === NetworkNames.BASE
    ? 'https://www.respace.one'
    : // : 'http://localhost:5000'
      'https://sepolia.respace.one'

export const RESPACE_SUBGRAPH_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://gateway.thegraph.com/api/c2921e95d896043ce3602d19cbbedcd2/subgraphs/id/CU3uKSKPmb5UP2imvySrJSHpU5DDnfpV5TdjWqbeZ85M'
    : 'https://api.studio.thegraph.com/query/88544/respace-base-sepolia/version/latest'

export const PENX_SUBGRAPH_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://gateway.thegraph.com/api/c2921e95d896043ce3602d19cbbedcd2/subgraphs/id/3xiEYVz3SuQ1rnTiwfwfuuHnxkh4EYM9RXqaErDwMUZE'
    : 'https://api.studio.thegraph.com/query/88544/creation-sepolia/version/latest'

export const TODO_DATABASE_NAME = '__TODO__'

export const FILE_DATABASE_NAME = '__FILE__'

export enum EditorMode {
  OUTLINER = 'OUTLINER',
  BLOCK = 'BLOCK',
}

export const WORKBENCH_NAV_HEIGHT = 54

export const DATABASE_TOOLBAR_HEIGHT = 42

export const SIDEBAR_WIDTH = 240

export const editorDefaultValue = [
  {
    type: 'p',
    children: [{ text: '' }],
  },
]

export const ALLOCATION_CAP_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://penx.io/api/allocation-cap'
    : 'https://sepolia.penx.io/api/allocation-cap'

export const DAILY_CLAIM_CAP_URL =
  NETWORK === NetworkNames.BASE
    ? 'https://penx.io/api/daily-claim-cap'
    : 'https://sepolia.penx.io/api/daily-claim-cap'

export const placeholderBlurhash =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg=='
