import {
  ELEMENT_FILE_CAPTION,
  ELEMENT_FILE_CONTAINER,
  ELEMENT_IMG,
} from '@penx/constants'
import { FileCaptionElement, FileContainerElement, ImageElement } from './types'

export function isFileContainer(node: any): node is FileContainerElement {
  return (node as FileContainerElement).type === ELEMENT_FILE_CONTAINER
}

export function isFileCaption(node: any): node is FileCaptionElement {
  return (node as FileCaptionElement).type === ELEMENT_FILE_CAPTION
}

export function isImageElement(node: any): node is ImageElement {
  return (node as ImageElement).type === ELEMENT_IMG
}
