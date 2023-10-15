import { nanoid } from 'nanoid'
import { SettingsType } from '@penx/constants'
import { ISpace } from '@penx/types'

export function getNewSpace(name: string): ISpace {
  const spaceId = nanoid()
  return {
    id: spaceId,
    name,
    isActive: false,
    changes: {},
    favorites: [],
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
