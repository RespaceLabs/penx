import { TableIcon } from 'lucide-react'
import { ExtensionContext } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { getEmptyTableNode } from './getEmptyTableNode'
import { ELEMENT_DATABASE } from './types'
import { Database } from './ui/Database'
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
