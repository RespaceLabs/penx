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
  APPEARANCE = 'appearance',
  PREFERENCES = 'preferences',
  HOTKEYS = 'hotkeys',
  ABOUT = 'about',
  EXTENSIONS = 'extensions',
}

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN as string

export enum ModalNames {
  DELETE_NODE,
  CREATE_SPACE,
  IMPORT_SPACE,
  DELETE_SPACE,
  LOGIN_SUCCESS,
}

export const ELEMENT_P = 'p'
export const ELEMENT_TITLE = 'title'

export const ELEMENT_UL = 'unordered-list'
export const ELEMENT_LI = 'list-item'
export const ELEMENT_LIC = 'list-item-text'
