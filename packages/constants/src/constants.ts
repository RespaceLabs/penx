export const IS_DB_OPENED = '__IS_DB_OPENED__'

export const isServer = typeof window === 'undefined'

export const isProd = process.env.NODE_ENV === 'production'

export const PENX_SESSION_USER = 'PENX_SESSION_USER'

export const PENX_SESSION_USER_ID = 'PENX_SESSION_USER_ID'

export const MASTER_PASSWORD = 'MASTER_PASSWORD'

export const TODO_DATABASE_NAME = '__TODO__'

export const isSelfHosted = process.env.NEXT_PUBLIC_DEPLOY_MODE !== 'PLATFORM'

export const NEXTAUTH_PROVIDERS = process.env.NEXT_PUBLIC_NEXTAUTH_PROVIDERS

export const PLATFORM =
  process.env.NEXT_PUBLIC_PLATFORM || process.env.PLASMO_PUBLIC_PLATFORM

export const ENV_BASE_URL =
  process.env.NEXT_PUBLIC_NEXTAUTH_URL || process.env.PLASMO_PUBLIC_BASE_URL

export const BASE_URL = (() => {
  if (ENV_BASE_URL) return ENV_BASE_URL
  if (isServer) return ''
  return `${location.protocol}//${location.host}`
})()

export const isExtension = PLATFORM === 'EXTENSION'

export enum SyncScope {
  CURRENT_DOC,
  ALL_CHANGES,
}

export enum SyncStrategy {
  MERGE,
  PR,
}

export enum WorkerEvents {
  START_POLLING,

  UPDATE_SESSION,

  START_PUSH,
  PUSH_SUCCEEDED,
  PUSH_FAILED,

  START_PULL,
  PULL_SUCCEEDED,
  PULL_FAILED,

  ADD_TEXT_SUCCEEDED,
}

export enum SyncStatus {
  NORMAL,

  PUSHING,
  PUSH_SUCCEEDED,
  PUSH_FAILED,

  PULLING,
  PULL_SUCCEEDED,
  PULL_FAILED,
}

export enum SettingsType {
  APPEARANCE = 'appearance',
  PREFERENCES = 'preferences',
  HOTKEYS = 'hotkeys',
  ABOUT = 'about',
  EXTENSIONS = 'extensions',
}

export enum ModalNames {
  DELETE_NODE,
  DELETE_COLUMN,
  DELETE_DATABASE,
  CREATE_SPACE,
  SYNC_SERVER,
  RESTORE_FROM_GITHUB,
  IMPORT_SPACE,
  DELETE_SPACE,
  LOGIN_SUCCESS,
  SYNC_DETECTOR,
  SIWE,
}

export enum RoleType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum SyncServerType {
  OFFICIAL = 'OFFICIAL',
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum NetworkNames {
  MAINNET = 'MAINNET',
  SEPOLIA = 'SEPOLIA',
  DEVELOP = 'DEVELOP',
  LOCAL = 'LOCAL',
}

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK as NetworkNames

export const RPC_URL_MAP: Record<NetworkNames, string> = {
  [NetworkNames.LOCAL]: process.env.NEXT_PUBLIC_LOCAL_RPC_URL!,
  [NetworkNames.DEVELOP]: process.env.NEXT_PUBLIC_DEVELOP_RPC_URL!,
  [NetworkNames.SEPOLIA]: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!,
  [NetworkNames.MAINNET]: process.env.NEXT_PUBLIC_DEVELOP_RPC_URL!,
}
