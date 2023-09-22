import { last } from 'lodash'
import {
  BasePoint,
  Editor,
  Element,
  Node,
  Point,
  Range,
  Transforms,
} from 'slate'
import { findNode, isCollapsed } from '@penx/editor-queries'
import { ElementType } from '@penx/editor-shared'
import { isUrl } from '@penx/editor-shared/src/isUrl'

export const withLink = (editor: Editor) => {
  const { insertData, insertText, normalizeNode } = editor

  editor.insertText = (text) => {
    if (!editor.selection || !isCollapsed(editor.selection)) {
      return insertText(text)
    }

    if (insertTextEndOfLink(editor, text)) return

    insertText(text)
  }

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain')

    if (text) {
      const linkNodeEntry = findNode(editor, {
        match: { type: ElementType.link },
      })

      // If the cursor is inside a link, just insert the text
      if (linkNodeEntry) {
        return editor.insertText(text)
      }

      if (isUrl(text)) {
        // If the text is an url, insert it as a link
        return Transforms.insertNodes(editor, {
          type: ElementType.link,
          url: text,
          children: [{ text }],
        })
      }
    }

    insertData(data)
  }

  /**
   *  remove link when the link is empty
   */
  editor.normalizeNode = ([node, path]) => {
    if (
      Element.isElement(node) &&
      node.type === ElementType.link &&
      Node.string(node) === ''
    ) {
      Transforms.removeNodes(editor, { at: path })
      return
    }

    normalizeNode([node, path])
  }

  return editor
}

/**
 * Insert text at the end of a link? If yes, insert a plan text.
 * @param editor
 * @param text
 * @returns
 */
function insertTextEndOfLink(
  editor: Editor,
  text: string,
): boolean | undefined {
  const { selection } = editor
  const { focus } = selection as Range

  const linkNodeEntry = findNode(editor, { match: { type: ElementType.link } })

  if (linkNodeEntry) {
    const [, linkPath] = linkNodeEntry
    const end = Editor.end(editor, linkPath)
    // The cursor is at the end of the link ?
    const isEndOfLink = Point.equals(focus, end)

    if (isEndOfLink) {
      const nextPath = [...linkPath.slice(0, -1), last(linkPath)! + 1]

      Transforms.insertNodes(editor, { text }, { at: nextPath })

      const point: BasePoint = {
        path: nextPath,
        offset: text.length,
      }

      // mover cursor to the end of the inserted text
      Transforms.select(editor, {
        anchor: point,
        focus: point,
      })
      return true
    }
  }
}
