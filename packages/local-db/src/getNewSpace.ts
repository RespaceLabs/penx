import { nanoid } from 'nanoid'
import { SettingsType } from '@penx/constants'
import { ISpace } from '@penx/types'

export function getNewSpace(name: string, id = nanoid()): ISpace {
  return {
    id,
    name,
    isActive: false,
    changes: {},
    favorites: [],
    snapshot: {
      repo: '',
      version: 0,
      hashMap: {},
    },
    settings: {
      [SettingsType.SYNC]: {
        repo: '',
        githubToken: '',
        privateKey: '',
      },

      [SettingsType.APPEARANCE]: {},

      [SettingsType.PREFERENCES]: {},

      [SettingsType.HOTKEYS]: {},

      [SettingsType.EXTENSIONS]: {},
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
