import { nanoid } from 'nanoid'
import { SettingsType } from '@penx/constants'
import { ISpace } from '@penx/model-types'
import { getRandomColor } from './getRandomColor'

export function getNewSpace(data: Partial<ISpace>): ISpace {
  return {
    id: nanoid(),
    name: 'My Space',
    sort: 1,
    isActive: true,
    isCloud: false,
    color: getRandomColor(),
    activeNodeIds: [],
    snapshot: {
      version: 0,
      nodeMap: {},
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...data,
  }
}
