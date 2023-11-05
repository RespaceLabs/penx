import { TableIcon } from 'lucide-react'
import { ExtensionContext } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { ELEMENT_DATABASE } from './constants'
import { Database } from './ui/Database'
import { withDatabase } from './withTable'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withDatabase,
    elements: [
      {
        isVoid: true,
        type: ELEMENT_DATABASE,
        component: Database,
        slashCommand: {
          name: 'Database',
          icon: TableIcon,
          async beforeInvokeCommand(editor) {
            return db.createDatabase({})
          },
        },
      },
    ],
  })
}

export * from './guard'
