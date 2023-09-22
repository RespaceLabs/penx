import { FC } from 'react'
import { BaseEditor, BaseElement, Editor, Element } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor, RenderElementProps } from 'slate-react'
import { ElementType } from '@penx/editor-shared'

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    elementMaps: Record<string, PluginElement>
    nodeToDecorations: Map<Element, Range[]>
  }

export interface BaseCustomElement extends BaseElement {
  id?: string
  selected?: boolean
  css?: any
}

export interface ParagraphElement extends BaseCustomElement {
  type: ElementType.p
}

export interface H1Element extends BaseCustomElement {
  type: ElementType.h1
}

export interface H2Element extends BaseCustomElement {
  type: ElementType.h2
}

export interface H3Element extends BaseCustomElement {
  type: ElementType.h3
}

export interface H4Element extends BaseCustomElement {
  type: ElementType.h4
}

export interface H5Element extends BaseCustomElement {
  type: ElementType.h5
}

export interface H6Element extends BaseCustomElement {
  type: ElementType.h6
}

export interface ListElement extends BaseCustomElement {
  type: ElementType.ul | ElementType.ol
}

export interface OrderedListElement extends BaseCustomElement {
  type: ElementType.ol
  children: ListItemElement[]
}

export interface ListItemElement extends BaseCustomElement {
  type: ElementType.li
}

export interface ListContentElement extends BaseCustomElement {
  type: ElementType.lic
}

export interface LinkElement extends BaseCustomElement {
  type: ElementType.link
  url: string
}

export interface TableElement extends BaseCustomElement {
  type: ElementType.table
  colWidths: number[] // table col widths
  isHeaderRow: boolean
  isHeaderColumn: boolean
  children: TableRowElement[]
}

export interface TableRowElement extends BaseCustomElement {
  type: ElementType.tr
  children: TableCellElement[]
}

export interface TableCellElement extends BaseCustomElement {
  type: ElementType.td
}

export interface BlockQuoteElement extends BaseCustomElement {
  type: ElementType.blockquote
}

export interface CheckListItemElement extends BaseCustomElement {
  type: ElementType.check_list_item
  checked: boolean
}

export interface CodeBlockElement extends BaseCustomElement {
  type: ElementType.code_block
  language: string
  highlightingLines?: number[]
  showLineNumbers?: boolean
  title?: string
  children: CodeLineElement[]
}

export interface CodeLineElement extends BaseCustomElement {
  type: ElementType.code_line
}

export interface FrontMatterBlockElement extends BaseCustomElement {
  type: ElementType.front_matter_block
  language: string
  children: FrontMatterLineElement[]
}

export interface FrontMatterLineElement extends BaseCustomElement {
  hint?: string
  isHinted?: boolean
  type: ElementType.front_matter_line
}

export interface ImageElement extends BaseCustomElement {
  type: ElementType.img
  url: string
  width: number // image width
  // children: CustomText[]
}

export interface MentionElement extends BaseCustomElement {
  type: ElementType.mention
  trigger: string // mention trigger
  mentionId: string | number // mention target id
  isOpen: boolean // popover is open
}

export interface MentionInputElement extends BaseCustomElement {
  type: ElementType.mention_input
  trigger: string // mention trigger
  mentionId?: string | number // mention target id
}

export interface BlockSelectorElement extends BaseCustomElement {
  type: ElementType.block_selector
  trigger: string
}

export interface InternalLinkSelectorElement extends BaseCustomElement {
  type: ElementType.internal_link_selector
  trigger: string
}

export interface InternalLinkContentElement extends BaseCustomElement {
  type: ElementType.internal_link_content
  linkName: string
  linkId: string
}

export interface AtomicPropsElement extends BaseCustomElement {
  type: ElementType.atomic_props
}

export interface AtomicPropsInputElement extends BaseCustomElement {
  type: ElementType.atomic_props_input
}

export interface DocListElement extends BaseCustomElement {
  type: ElementType.doc_list
}

export interface DocContentElement extends BaseCustomElement {
  type: ElementType.doc_content
}

export interface SimpleSpaceHeaderElement extends BaseCustomElement {
  type: ElementType.simple_space_header
  width?: number | string
}

export interface ContainerElement extends BaseCustomElement {
  type: ElementType.container
  width?: number | string
}

export interface PreviousNextElement extends BaseCustomElement {
  type: ElementType.previous_next
}

export interface TableElement extends BaseCustomElement {
  type: ElementType.table
  colWidths: number[] // table col widths
  children: TableRowElement[]
}

export interface TableRowElement extends BaseCustomElement {
  type: ElementType.tr
  children: TableCellElement[]
}

export interface TableCellElement extends BaseCustomElement {
  type: ElementType.td
}

export interface DividerElement extends BaseCustomElement {
  type: ElementType.hr
}

export type CustomElement =
  | ParagraphElement
  | H1Element
  | H2Element
  | H3Element
  | H4Element
  | H5Element
  | H6Element
  | OrderedListElement
  | ListElement
  | ListItemElement
  | ListContentElement
  | LinkElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | BlockQuoteElement
  | CheckListItemElement
  | CodeBlockElement
  | CodeLineElement
  | FrontMatterBlockElement
  | FrontMatterLineElement
  | ImageElement
  | MentionElement
  | MentionInputElement
  | BlockSelectorElement
  | AtomicPropsElement
  | AtomicPropsInputElement
  | DocListElement
  | DocContentElement
  | SimpleSpaceHeaderElement
  | ContainerElement
  | PreviousNextElement
  | DividerElement
  | InternalLinkSelectorElement
  | InternalLinkContentElement

type CustomText = {
  text: string

  selected?: boolean

  id?: string
  type?: any

  bold?: true
  italic?: true
  underline?: true

  /**
   * is inline code
   */
  code?: true

  strike_through?: true
  highlight?: true
  subscript?: true
  superscript?: true
  language?: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor & {
      type?: string
      id?: string
      selected?: boolean
    }
    Element: CustomElement
    Text: CustomText
  }
}

export interface PluginElement {
  name?: string

  type: `${ElementType}` | ({} & string)

  component: FC<ElementProps<any>>
  defaultValue?: Element
  isInline?: boolean
  shouldNested?: boolean
  icon?: any
  isVoid?: boolean
  placeholder?: string
  configPanelWidth?: number
  defaultConfig?: Record<string, any>

  configSchema?: Array<{
    component: string
    name: string
    label?: string
    options?: Array<{
      label: string
      value: string
      // [key: string]: any
    }>
    defaultValue?: any
    [key: string]: any
  }>
}

export interface EditorPlugin {
  with?: (editor: Editor) => Editor
  elements?: PluginElement[]
}

export interface ElementProps<E = Element>
  extends Omit<RenderElementProps, 'element' | 'attributes'> {
  element: E
  attributes: RenderElementProps['attributes'] & {
    'data-slate-id'?: string
    onClick?: any
  }
  atomicProps?: any
  nodeProps?: {
    style?: any
    css?: any
    className: string
    placeholder?: string
    flex?: string | number
  }
}
