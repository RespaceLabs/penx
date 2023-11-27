import { Atom, WritableAtom } from 'jotai'
import {
  RegisterBlockOptions,
  RegisterComponentOptions,
  SettingsSchema,
} from '@penx/extension-typings'

type pluginId = string

export type ExtensionStore = Record<
  pluginId,
  {
    components: Array<RegisterComponentOptions>
    block: RegisterBlockOptions
    settingsSchema: SettingsSchema
  }
>

export type RouteName =
  | 'TRASH'
  | 'NODE'
  | 'ACCOUNT_SETTINGS'
  | 'SPACE_SETTINGS'
  | 'SET_PASSWORD'

export type RouterStore = {
  name: RouteName
  params: Record<string, any>
}

export type SettingsRouterStore = {
  name: RouteName
  params: Record<string, any>
}

export type Command = {
  id: string
  name: string
  pluginId?: string
  handler: () => void
}

export interface BaseStore {
  get: <Value>(atom: Atom<Value>) => Value
  set: <Value_1, Args extends unknown[], Result>(
    atom: WritableAtom<Value_1, Args, Result>,
    ...args: Args
  ) => Result
}
export interface Session {
  user: {
    name: string
    email: string
    image: string
    id: string
  }
  expires: string
  accessToken: string
  userId: string
}
