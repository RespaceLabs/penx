import { BaseElement } from 'slate'
import { ELEMENT_IMG } from '@penx/constants'

export interface ImageElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_IMG
  url: string
  mime: string
  width: number // image width
  googleDriveFileId: string
  hash: string
}
