export const IS_DB_OPENED = '__IS_DB_OPENED__'

export const isServer = typeof window === 'undefined'

export const isProd = process.env.NODE_ENV === 'production'

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

  START_PUSH,
  PUSH_SUCCEEDED,
  PUSH_FAILED,

  START_PULL,
  PULL_SUCCEEDED,
  PULL_FAILED,
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
  SYNC = 'sync',
  APPEARANCE = 'appearance',
  PREFERENCES = 'preferences',
  HOTKEYS = 'hotkeys',
  ABOUT = 'about',
  EXTENSIONS = 'extensions',
}
