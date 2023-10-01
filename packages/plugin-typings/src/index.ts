import { FC, KeyboardEvent, useCallback } from 'react'
import { Editor, Element } from 'slate'
import { RenderElementProps } from 'slate-react'

export interface PluginContext {
  pluginId?: string

  registerCommand(name: string, callback: () => void): void

  executeCommand(id: string): void

  registerComponent(options: RegisterComponentOptions): void

  registerBlock(options: RegisterBlockOptions): void

  createSettings(schema: any[]): void

  notify(message: string, options?: any): any
}

export interface RegisterComponentOptions {
  at: 'status_bar' | 'activity_bar'
  component: any
}

export interface RegisterBlockOptions {
  with?: (editor: Editor) => Editor
  handlers?: {
    onKeyDown: OnKeyDown
  }
  elements?: BlockElement[]
}

export type OnKeyDown = (
  editor: Editor,
  e: KeyboardEvent<HTMLDivElement>,
) => boolean | void

export interface BlockElement {
  type: string

  component: FC<ElementProps<any>>

  name?: string

  isInline?: boolean

  isVoid?: boolean

  shouldNested?: boolean

  icon?: any

  placeholder?: string

  defaultValue?: Element
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
