import { FC, KeyboardEvent } from 'react'
import { AutoformatRule } from '@udecode/plate-autoformat'
import { Editor, Element } from 'slate'
import { RenderElementProps } from 'slate-react'

export interface PluginContext {
  pluginId?: string

  registerCommand(options: RegisterCommandOptions): void

  executeCommand(id: string): void

  registerComponent(options: RegisterComponentOptions): void

  registerBlock(options: RegisterBlockOptions): void

  createSettings(schema: any[]): void

  notify(message: string, options?: any): any
}

export interface RegisterCommandOptions {
  id: string
  name: string
  handler: () => void
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

  // TODO: handle any
  autoformatRules?: AutoformatRule<any, any>[]
}

export type OnKeyDown = (
  editor: Editor,
  e: KeyboardEvent<HTMLDivElement>,
) => boolean | void

export interface BlockElement {
  type: string

  component: FC<ElementProps<any>>

  isInline?: boolean

  isVoid?: boolean

  shouldNested?: boolean

  placeholder?: string

  /**
   * should be shown in slash command list
   */
  slashCommand?: {
    name: string
    description?: string
    icon?: any
    defaultNode?: Element
    afterInvokeCommand?: (editor: Editor) => void
  }
}

export interface ElementProps<E = Element>
  extends Omit<RenderElementProps, 'element' | 'attributes'> {
  element: E
  attributes: RenderElementProps['attributes'] & {
    'data-slate-id'?: string
    onClick?: any
  }
  nodeProps?: {
    style?: any
    css?: any
    className: string
    placeholder?: string
    flex?: string | number
  }
}
