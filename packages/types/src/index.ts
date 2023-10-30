import {
  RegisterBlockOptions,
  RegisterComponentOptions,
  SettingsSchema,
} from '@penx/extension-typings'

export * from './interfaces'

type pluginId = string

export type RouteName = 'TRASH' | 'SYNC' | 'NODE'

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

export type TreeItem = {
  path: string
  // mode: '100644' | '100755' | '040000' | '160000' | '120000'
  mode: '100644'
  // type: 'blob' | 'tree' | 'commit'
  type: 'blob'
  content?: string
  sha?: string | null
}
