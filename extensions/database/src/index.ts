import { TableIcon } from 'lucide-react'
import {
  ELEMENT_DATABASE,
  ELEMENT_DATABASE_ENTRY,
  ELEMENT_LIVE_QUERY,
} from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { Database } from './ui/Database'
import { DatabaseEntry } from './ui/DatabaseEntry'
import { LiveQuery } from './ui/LiveQuery/LiveQuery'
import { withDatabase } from './withDatabase'

export * from './guard'
export * from './ui/TableView'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: withDatabase,
    elements: [
      {
        isVoid: true,
        type: ELEMENT_DATABASE,
        component: Database,
        // slashCommand: {
        //   name: 'Database',
        //   icon: TableIcon,
        //   async beforeInvokeCommand(editor) {
        //     console.log('before.............')
        //     return db.createDatabase('')
        //   },
        // },
      },

      {
        isVoid: true,
        type: ELEMENT_DATABASE_ENTRY,
        component: DatabaseEntry,
      },

      {
        isVoid: true,
        type: ELEMENT_LIVE_QUERY,
        component: LiveQuery,
        // slashCommand: {
        //   name: 'Live Query',
        //   icon: TableIcon,
        // },
      },
    ],
  })
}
