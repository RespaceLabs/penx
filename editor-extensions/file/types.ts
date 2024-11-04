import { BaseElement } from 'slate'
import { ELEMENT_FILE } from '@/lib/constants'

export interface FileElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_FILE
  fileId: string
}
