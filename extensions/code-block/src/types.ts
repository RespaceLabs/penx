import { BaseElement } from 'slate'
import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from '@penx/constants'

export interface CodeBlockElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_CODE_BLOCK
  language: string
  highlightingLines?: number[]
  showLineNumbers?: boolean
  title?: string
}

export interface CodeLineElement extends BaseElement {
  id?: string
  type: typeof ELEMENT_CODE_LINE
}
