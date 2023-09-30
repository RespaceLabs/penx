import { Editor, Element, Point, Range, Transforms } from 'slate'
import {
  getCurrentNode,
  getPreviousBlockById,
  isCollapsed,
} from '@penx/editor-queries'
import { rules } from './rules'
import { formatBlock } from './transforms/formatBlock'
import { formatMark } from './transforms/formatMark'
import { formatText } from './transforms/formatText'

/**
 * Enables support for autoformatting actions.
 * Once a match rule is validated, it does not check the following rules.
 */
export const withAutoformat = (editor: Editor) => {
  const { insertText, deleteBackward } = editor

  editor.insertText = (text) => {
    if (!isCollapsed(editor.selection)) return insertText(text)

    const match = Editor.above(editor, {
      match: (n: any) => ['code_block'].includes(n.type),
    })

    if (match?.[0]) {
      return insertText(text)
    }

    for (const rule of rules) {
      const { mode = 'text' } = rule

      const formatter: Record<typeof mode, Function> = {
        block: formatBlock,
        mark: formatMark,
        text: formatText,
      }

      const isFormatted = formatter[mode]?.(editor, { ...rule, text })

      if (isFormatted) return
    }

    insertText(text)
  }

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (!isCollapsed(selection)) return deleteBackward(...args)

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n as Element),
      })

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        const isStartOfBlock =
          !Editor.isEditor(block) &&
          Element.isElement(block) &&
          Point.equals(selection.anchor, start)

        const isGeneral = ['p', 'lic', 'code_line'].includes(
          (block as any).type,
        )

        if (isStartOfBlock) {
          const { id } = getCurrentNode(editor)!

          // for fist line block
          if (
            block.type == 'p' &&
            editor.children.length > 1 &&
            editor.children[0] === block
          ) {
            Transforms.removeNodes(editor, { at: path })
            return
          }

          if (isGeneral) {
            const nodeEntry = getPreviousBlockById(editor, id!)!

            if (!nodeEntry) {
              deleteBackward(...args) // TODO:
              return
            }

            const [prevNode, prevPath] = nodeEntry

            if ((prevNode as Element)?.type === 'table') {
              Transforms.select(editor, Editor.end(editor, prevPath))
              return
            }
          } else {
            const newProperties: Partial<Element> = { type: 'p' } as any
            Transforms.setNodes(editor, newProperties)
            return
          }
        }
      }

      deleteBackward(...args)
    }
  }

  return editor
}
