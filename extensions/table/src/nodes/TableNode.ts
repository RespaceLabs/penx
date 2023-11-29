import { produce } from 'immer'
import { Editor, Path, Transforms } from 'slate'
import { findNodePath } from '@penx/editor-queries'
import { getEmptyCellNode } from '../getEmptyCellNode'
import { getEmptyRowNode } from '../getEmptyRowNode'
import { TableCellElement, TableElement } from '../types'

export class TableNode {
  constructor(
    private editor: Editor,
    private element: TableElement,
  ) {}

  get firstRowElement() {
    return this.element.children[0]
  }

  get firstRowPath(): Path {
    return findNodePath(this.editor, this.firstRowElement) || []
  }

  get columnCount() {
    return this.firstRowElement.children.length
  }

  get rowCount() {
    return this.element.children.length
  }

  get path() {
    return findNodePath(this.editor, this.element) || []
  }

  /**
   * add a new column to the table
   * @param columnIndex the target column index
   */
  addColumn(columnIndex = this.columnCount) {
    this.element.children!.forEach((_, index) => {
      const at = [...this.path, index, columnIndex]
      Transforms.insertNodes(this.editor, getEmptyCellNode(), {
        at,
        select: index === 0,
      })
    })
  }

  addRow(rowIndex = this.rowCount) {
    // insert empty row
    Transforms.insertNodes(this.editor, getEmptyRowNode(this.columnCount), {
      at: [...this.path, rowIndex],
      select: true,
    })
  }

  deleteColumn(cell: TableCellElement) {
    const cellPath = findNodePath(this.editor, cell)!
    this.element.children!.forEach((_, index) => {
      const at = produce(cellPath, (draft) => {
        draft[cellPath.length - 2] = index
      })
      Transforms.removeNodes(this.editor, { at })
    })
  }

  removeRow(cell: TableCellElement) {
    const cellPath = findNodePath(this.editor, cell)
    const rowPath = Path.parent(cellPath!)
    Transforms.removeNodes(this.editor, { at: rowPath })
  }
}
