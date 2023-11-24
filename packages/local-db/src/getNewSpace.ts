import { SettingsType } from '@penx/constants'
import { ISpace } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'
import { getRandomColor } from './getRandomColor'

export function getNewSpace(data: Partial<ISpace>): ISpace {
  return {
    id: uniqueId(),
    name: 'My Space',
    sort: 1,
    // version: 0,
    isActive: true,
    isCloud: false,
    encrypted: false,
    color: getRandomColor(),
    activeNodeIds: [],
    nodeSnapshot: {
      version: 0,
      nodeMap: {},
    },
    pageSnapshot: {
      version: 0,
      pageMap: {},
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  }
}
