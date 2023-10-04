import { TableCellsOutline } from '@bone-ui/icons'
import { Element, Node } from 'slate'
import { PluginContext } from '@penx/plugin-typings'
import { getEmptyTableNode } from './getEmptyTableNode'
import {
  ElementType,
  TableCellElement,
  TableElement,
  TableRowElement,
} from './types'
import { Table } from './ui/Table/Table'
import { TableCell } from './ui/TableCell'
import { TableRow } from './ui/TableRow'
import { withTable } from './withTable'

export function activate(ctx: PluginContext) {
  ctx.registerBlock({
    with: withTable,
    elements: [
      {
        shouldNested: true,
        type: ElementType.table,
        component: Table,
        slashCommand: {
          name: 'Table',
          icon: TableCellsOutline,
          defaultNode: getEmptyTableNode(),
        },
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
  })
}

export * from './guard'
