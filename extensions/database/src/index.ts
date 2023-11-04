import { TableIcon } from 'lucide-react'
import { ExtensionContext } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { getEmptyTableNode } from './getEmptyTableNode'
import { ELEMENT_DATABASE, ELEMENT_TD, ELEMENT_TR } from './types'
import { Database } from './ui/Table/Database'
import { TableCell } from './ui/TableCell'
import { TableRow } from './ui/TableRow'
import { withTable } from './withTable'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withTable,
    elements: [
      {
        isVoid: true,
        type: ELEMENT_DATABASE,
        component: Database,
        slashCommand: {
          name: 'Database',
          icon: TableIcon,
          async beforeInvokeCommand(editor) {
            console.log('xooeeo.......')
            return db.createDatabase({})
          },
        },
      },
    ],
  })
}

export * from './guard'
