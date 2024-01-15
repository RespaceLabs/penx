import { TableIcon } from 'lucide-react'
import {
  ELEMENT_DAILY_ENTRY,
  ELEMENT_DATABASE,
  ELEMENT_DATABASE_CONTAINER,
  ELEMENT_DATABASE_ENTRY,
  ELEMENT_LIVE_QUERY,
  ELEMENT_TAG,
  ELEMENT_TAG_SELECTOR,
} from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { DataSource } from '@penx/model-types'
import { store } from '@penx/store'
import { onBlur } from './handlers/onBlur'
import { onKeyDown } from './handlers/onKeyDown'
import { DailyEntry } from './ui/DailyEntry'
import { Database } from './ui/Database'
import { DatabaseContainer } from './ui/DatabaseContainer'
import { DatabaseEntry } from './ui/DatabaseEntry'
import { LiveQuery } from './ui/LiveQuery/LiveQuery'
import { Tag } from './ui/tag/Tag'
import { TagSelector } from './ui/tag/TagSelector'
import { withDatabase } from './withDatabase'
import { withTag } from './withTag'

export * from './guard'
export * from './isTag'
export * from './ui/views/TableView/PublishedTableView'

export function activate(ctx: ExtensionContext) {
  ctx.registerBlock({
    with: [withDatabase, withTag],
    handlers: {
      onKeyDown: onKeyDown,
      onBlur: onBlur,
    },
    elements: [
      {
        isVoid: true,
        type: ELEMENT_DATABASE_ENTRY,
        component: DatabaseEntry,
      },

      {
        isVoid: true,
        type: ELEMENT_DATABASE_CONTAINER,
        component: DatabaseContainer,
        slashCommand: {
          in: ['BLOCK', 'BLOCK'],
          name: 'Database',
          icon: TableIcon,
          async beforeInvokeCommand(editor) {
            const node = await db.createDatabase(
              'Untitled',
              DataSource.COMMON,
              true,
            )
            const newNodes = await db.listNodesBySpaceId(node.spaceId)
            store.node.setNodes(newNodes)
            return node
          },
        },
      },

      {
        isVoid: true,
        type: ELEMENT_DATABASE,
        component: Database,
      },

      {
        isVoid: true,
        type: ELEMENT_DAILY_ENTRY,
        component: DailyEntry,
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
      {
        isInline: true,
        type: ELEMENT_TAG_SELECTOR,
        component: TagSelector,
      },
      {
        isInline: true,
        isVoid: true,
        type: ELEMENT_TAG,
        component: Tag,
      },
    ],
  })
}
