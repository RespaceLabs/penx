import { TableIcon } from 'lucide-react'
import {
  ELEMENT_DATABASE,
  ELEMENT_DATABASE_ENTRY,
  ELEMENT_LIVE_QUERY,
  ELEMENT_TAG,
  ELEMENT_TAG_SELECTOR,
} from '@penx/constants'
import { ExtensionContext } from '@penx/extension-typings'
import { onBlur } from './handlers/onBlur'
import { onKeyDown } from './handlers/onKeyDown'
import { Database } from './ui/Database'
import { DatabaseEntry } from './ui/DatabaseEntry'
import { LiveQuery } from './ui/LiveQuery/LiveQuery'
import { Tag } from './ui/tag/Tag'
import { TagSelector } from './ui/tag/TagSelector'
import { withDatabase } from './withDatabase'
import { withTag } from './withTag'

export * from './guard'
export * from './isTag'

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
