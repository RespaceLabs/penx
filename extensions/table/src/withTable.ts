import { Editor, Element, Point, Range } from 'slate'
import { PenxEditor } from '@penx/editor-common'
import { isTableCell } from './guard'

export const withTable = (editor: PenxEditor) => {
  const { deleteBackward, deleteForward, insertBreak } = editor

  editor.deleteBackward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && isTableCell(n),
      })

      if (cell) {
        const [, cellPath] = cell
        const start = Editor.start(editor, cellPath)

        // don't delete cell
        if (Point.equals(selection.anchor, start)) {
          return
        }
      }
    }

    deleteBackward(unit)
  }

  editor.deleteForward = (unit) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && isTableCell(n),
      })

      if (cell) {
        const [, cellPath] = cell
        const end = Editor.end(editor, cellPath)

        if (Point.equals(selection.anchor, end)) {
          return
        }
      }
    }

    deleteForward(unit)
  }

  return editor
}
