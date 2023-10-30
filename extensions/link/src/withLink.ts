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
import { ReactEditor } from 'slate-react'
import { PenxEditor } from '@penx/editor-common'
import { findNode, isCollapsed } from '@penx/editor-queries'
import { isUrl } from '@penx/editor-shared/src/isUrl'
import { isLinkElement } from './isLinkElement'
import { ELEMENT_LINK, LinkElement } from './types'

export const withLink = (editor: PenxEditor) => {
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

    console.log('text:', text)

    if (text) {
      const linkNodeEntry = findNode(editor, {
        match: { type: ELEMENT_LINK },
      })

      // If the cursor is inside a link, just insert the text
      if (linkNodeEntry) {
        return editor.insertText(text)
      }

      if (isUrl(text)) {
        // If the text is an url, insert it as a link
        return Transforms.insertNodes<LinkElement>(editor, {
          type: ELEMENT_LINK,
          url: text,
          children: [{ text }],
        } as LinkElement)
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
      isLinkElement(node) &&
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

  const linkNodeEntry = findNode(editor, { match: { type: ELEMENT_LINK } })

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
