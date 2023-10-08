import { FC, KeyboardEvent } from 'react'
import { Editor, Element } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor, RenderElementProps } from 'slate-react'
import { AutoformatRule } from '@penx/autoformat'

export type PenxEditor = Editor & HistoryEditor & ReactEditor

export interface ExtensionContext {
  pluginId?: string

  registerCommand(options: RegisterCommandOptions): void

  executeCommand(id: string): void

  registerComponent(options: RegisterComponentOptions): void

  registerBlock(options: RegisterBlockOptions): void

  defineSettings(schema: SettingsSchema): void

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
  with?: (editor: PenxEditor) => Editor
  handlers?: {
    onKeyDown: OnKeyDown
  }
  elements?: BlockElement[]

  // TODO: handle any
  autoformatRules?: AutoformatRule<any, any>[]
}

export type SettingsSchemaItem = {
  label: string
  description?: string
  name: string
  component:
    | 'Input'
    | 'NumberInput'
    | 'Select'
    | 'Checkbox'
    | 'Switch'
    | 'Textarea'
  placeholder?: string
}

export type SettingsSchema = SettingsSchemaItem[]

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

export interface Manifest {
  name: string

  id: string

  version: string

  main: string

  code: string

  description: string
}
