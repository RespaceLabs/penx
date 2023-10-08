import { BaseElement } from 'slate'

export const ELEMENT_LINK = 'a'

export interface LinkElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_LINK
  url: string
}

export type GetLinkUrl = (prevUrl: string | null) => Promise<string | null>
