import {
  ELEMENT_DAILY_ENTRY,
  ELEMENT_DATABASE,
  ELEMENT_DATABASE_CONTAINER,
  ELEMENT_DATABASE_ENTRY,
  ELEMENT_LIVE_QUERY,
  ELEMENT_TAG,
  ELEMENT_TAG_SELECTOR,
} from '@/lib/constants'
import { ExtensionContext } from '@/lib/extension-typings'
import { db } from '@/lib/local-db'
import { store } from '@/store'
import { TableIcon } from 'lucide-react'
import { onBlur } from './handlers/onBlur'
import { onKeyDown } from './handlers/onKeyDown'
import { DailyEntry } from './ui/DailyEntry'
import { Database } from './ui/Database'
import { DatabaseContainer } from './ui/DatabaseContainer'
import { DatabaseEntry } from './ui/DatabaseEntry'
import { Tag } from './ui/tag/Tag'
import { TagSelector } from './ui/tag/TagSelector'
import { withDatabase } from './withDatabase'
import { withTag } from './withTag'

export * from './guard'
export * from './isTag'
export * from './ui/TagDrawer'
export * from './hooks/useTagDrawer'

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
          // in: ['BLOCK', 'OUTLINER'],
          in: [],
          name: 'Database',
          icon: TableIcon,
          async beforeInvokeCommand(editor) {
            const node = await db.createDatabase({
              name: 'Untitled',
              shouldInitCells: true,
            })
            const newNodes = await db.listNodesByUserId()
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
