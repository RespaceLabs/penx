import { nanoid } from 'nanoid'
import { INITIAL_EDITOR_VALUE } from '@penx/constants'
import { DocStatus, IDoc } from '@penx/types'

export function getNewDoc(spaceId: string): IDoc {
  return {
    id: nanoid(),
    spaceId,
    title: '',
    content: JSON.stringify(INITIAL_EDITOR_VALUE),
    status: DocStatus.NORMAL,
    openedAt: Date.now(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}
