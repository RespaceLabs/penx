import { BaseElement } from 'slate'
import { ELEMENT_FILE } from '@penx/constants'

export interface FileElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_FILE
  fileId: string
}
