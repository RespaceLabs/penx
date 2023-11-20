import { TableIcon } from 'lucide-react'
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { getEmptyTableNode } from './getEmptyTableNode'
import { Table } from './ui/Table/Table'
import { TableCell } from './ui/TableCell'
import { TableRow } from './ui/TableRow'
import { withTable } from './withTable'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withTable,
    elements: [
      {
        shouldNested: true,
        type: ELEMENT_TABLE,
        component: Table,
        // slashCommand: {
        //   name: 'Table',
        //   icon: TableIcon,
        //   defaultNode: getEmptyTableNode(),
        // },
      },
      {
        type: ELEMENT_TR,
        component: TableRow,
      },
      {
        type: ELEMENT_TD,
        component: TableCell,
      },
    ],
  })
}

export * from './guard'
