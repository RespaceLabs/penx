import { TableCellsOutline } from '@bone-ui/icons'
import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { getEmptyTableNode } from './getEmptyTableNode'
import { Table } from './ui/Table/Table'
import { TableCell } from './ui/TableCell'
import { TableRow } from './ui/TableRow'
import { withTable } from './withTable'

export default function table(): EditorPlugin {
  return {
    with: withTable,
    elements: [
      {
        name: 'Table',
        icon: TableCellsOutline,
        shouldNested: true,
        defaultValue: getEmptyTableNode(),
        type: ElementType.table,
        component: Table,
      },
      {
        type: ElementType.tr,
        component: TableRow,
      },
      {
        type: ElementType.td,
        component: TableCell,
      },
    ],
  }
}
