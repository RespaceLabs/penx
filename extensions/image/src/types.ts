import { BaseElement } from 'slate'
import {
  ELEMENT_FILE_CAPTION,
  ELEMENT_FILE_CONTAINER,
  ELEMENT_IMG,
} from '@penx/constants'

export interface FileContainerElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_FILE_CONTAINER
}

export interface FileCaptionElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_FILE_CAPTION
}

export interface ImageElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_IMG
  url: string
  mime: string
  width: number // image width
  googleDriveFileId: string
  fileHash: string
}
