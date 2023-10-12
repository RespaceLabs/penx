import { BaseElement } from 'slate'

export const ELEMENT_FILE = 'file'

export interface FileElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_FILE
  fileId: string
}
