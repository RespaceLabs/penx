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
  | 'CREATE_SPACE'

export type IRouterStore = {
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
