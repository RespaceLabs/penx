import { BaseElement } from 'slate'

export enum ElementType {
  link = 'a',
}

export interface LinkElement extends BaseElement {
  id?: string
  type: ElementType.link
  url: string
}

export type GetLinkUrl = (prevUrl: string | null) => Promise<string | null>
