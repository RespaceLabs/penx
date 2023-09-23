import { SettingsType } from '@penx/constants'

export enum ChangeType {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ADD = 'ADD',
}

export interface ISpace {
  id: string

  name: string

  description?: string

  catalogue: any

  isActive: boolean

  activeDocId?: string

  changes: Record<
    string,
    {
      type: ChangeType

      oldContent?: string

      newContent?: string
    }
  >

  settings: {
    [SettingsType.SYNC]: {
      githubToken: string
      repo: string
      privateKey: string
    }
    [SettingsType.APPEARANCE]: Record<string, any>
    [SettingsType.HOTKEYS]: Record<string, any>
    [SettingsType.PREFERENCES]: Record<string, any>
    [key: string]: Record<string, any>
  }

  commitTree?: any

  commitSha?: string

  commitDate?: Date

  createdAt: Date

  updatedAt: Date
}
