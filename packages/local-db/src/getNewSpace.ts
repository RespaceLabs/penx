import { nanoid } from 'nanoid'
import { SettingsType } from '@penx/constants'
import { ISpace } from '@penx/types'

export function getNewSpace(data: Partial<ISpace>): ISpace {
  return {
    id: nanoid(),
    name: 'My Space',
    isActive: false,
    changes: {},
    favorites: [],
    children: [],
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

      // TODO
      [SettingsType.EXTENSIONS]: {
        'github-sync': {
          repo: '',
          githubToken: '',
        },
      },
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data,
  }
}
