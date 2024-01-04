import { EditorMode, ISpace } from '@penx/model-types'
import { uniqueId } from '@penx/unique-id'
import { getRandomColor } from './getRandomColor'

export function getNewSpace(data: Partial<ISpace>): ISpace {
  return {
    id: uniqueId(),
    userId: '',
    editorMode: EditorMode.OUTLINE,
    name: 'My Space',
    sort: 1,
    // version: 0,
    isActive: true,
    encrypted: false,
    password: '',
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
