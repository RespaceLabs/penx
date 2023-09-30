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

export interface AtomicPropsElement extends BaseCustomElement {
  type: ElementType.atomic_props
}

export interface AtomicPropsInputElement extends BaseCustomElement {
  type: ElementType.atomic_props_input
}

export interface ContainerElement extends BaseCustomElement {
  type: ElementType.container
  width?: number | string
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

export type CustomElement =
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
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
  | ContainerElement

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
