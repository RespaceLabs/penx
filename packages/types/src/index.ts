import {
  RegisterBlockOptions,
  RegisterComponentOptions,
  SettingsSchema,
} from '@penx/extension-typings'

export * from './interfaces'

type pluginId = string

export type RouteName = 'DOC' | 'TRASH' | 'ALL_DOCS' | 'SYNC'

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

export type ExtensionStore = Record<
  pluginId,
  {
    components: Array<RegisterComponentOptions>
    block: RegisterBlockOptions
    settingsSchema: SettingsSchema
  }
>
