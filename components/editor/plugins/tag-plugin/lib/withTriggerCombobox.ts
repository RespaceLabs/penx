import isEqual from 'react-fast-compare'
import { Editor, Range } from 'slate'
import { TriggerComboboxPluginOptions } from '@udecode/plate-combobox'
import {
  getEditorString,
  getPointBefore,
  getRange,
  type ExtendEditor,
  type PluginConfig,
  type SlateEditor,
  type TElement,
} from '@udecode/plate-common'

export const withTriggerCombobox: ExtendEditor<
  PluginConfig<any, TriggerComboboxPluginOptions>
> = ({ editor, getOptions, type }) => {
  const { insertText } = editor

  const matchesTrigger = (text: string) => {
    const { trigger } = getOptions()

    if (trigger instanceof RegExp) {
      return trigger.test(text)
    }
    if (Array.isArray(trigger)) {
      return trigger.includes(text)
    }

    return text === trigger
  }

  const isAtStartOfLine = (editor: any) => {
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const [node] =
        Editor.above(editor as any, {
          match: (n) => Editor.isBlock(editor, n as any),
        }) || []

      if (node) {
        const start = Editor.start(editor, anchor.path)
        return isEqual(anchor, start)
      }
    }
    return false
  }
  const getPreviousCharacter = (editor: any) => {
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const currentNode = Editor.node(editor, anchor.path)
      const offset = anchor.offset

      if (offset > 0 && currentNode) {
        const [node] = currentNode as any

        const text = node.text
        return text.charAt(offset - 1)
      }
    }

    return null
  }

  editor.insertText = (text) => {
    const { createComboboxInput, triggerPreviousCharPattern, triggerQuery } =
      getOptions()

    if (
      !editor.selection ||
      !matchesTrigger(text) ||
      (triggerQuery && !triggerQuery(editor as SlateEditor)) ||
      isAtStartOfLine(editor) ||
      getPreviousCharacter(editor) === '#'
    ) {
      return insertText(text)
    }

    const inputNode: TElement = createComboboxInput
      ? createComboboxInput(text)
      : { children: [{ text: '' }], type }

    return editor.insertNode(inputNode)
  }

  return editor
}
