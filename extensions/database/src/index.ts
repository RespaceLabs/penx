import { TableIcon } from 'lucide-react'
import { ExtensionContext } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { ELEMENT_DATABASE, ELEMENT_NODE_QUERY } from './constants'
import { Database } from './ui/Database'
import { NodeQuery } from './ui/NodeQuery'
import { withDatabase } from './withDatabase'

export * from './guard'

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
            return db.createDatabase()
          },
        },
      },

      {
        isVoid: true,
        type: ELEMENT_NODE_QUERY,
        component: NodeQuery,
        slashCommand: {
          name: 'Node Query',
          icon: TableIcon,
        },
      },
    ],
  })
}
