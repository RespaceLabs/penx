import { SettingsType } from '@penx/constants'

export interface ISpace {
  id: string

  /**
   * wallet address
   */
  address: string

  name: string

  description?: string

  color: string

  isActive: boolean

  activeNodeId?: string

  snapshot: {
    version: number
    nodeMap: Record<string, string>
  }

  settings: {
    [SettingsType.APPEARANCE]: Record<string, any>
    [SettingsType.HOTKEYS]: Record<string, any>
    [SettingsType.PREFERENCES]: Record<string, any>
    [SettingsType.EXTENSIONS]: Record<string, any>
    [key: string]: Record<string, any>
  }

  createdAt: number

  updatedAt: number
}
