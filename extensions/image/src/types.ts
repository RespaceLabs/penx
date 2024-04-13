import { BaseElement } from 'slate'

export const ELEMENT_IMG = 'img'

export interface ImageElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_IMG
  url: string
  mime: string
  width: number // image width
  googleDriveId: string
  hash: string
}
