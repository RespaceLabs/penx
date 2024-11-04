import { isMobile } from 'react-device-detect'
import { ELEMENT_P } from '@/lib/constants'
import { ContextMenu, MenuItem, useContextMenu } from '@/lib/context-menu'
import { DatabaseProvider, WithStoreDatabase } from '@/lib/database-context'
import { TagForm } from '@/lib/database-ui'
import { useEditorStatic } from '@/lib/editor-common'
import { findNodePath } from '@/lib/editor-queries'
import { genId } from '@/lib/editor-shared'
import { ElementProps } from '@/lib/extension-typings'
import { db } from '@/lib/local-db'
import { useNodes } from '@/lib/node-hooks'
import { cn } from '@/lib/utils'
import { store } from '@/store'

import { useSelected } from 'slate-react'
import { useTagDrawer } from '../../hooks/useTagDrawer'
import { TagElement } from '../../types'

export const Tag = ({
  element,
  attributes,
  children,
}: ElementProps<TagElement>) => {
  const editor = useEditorStatic()

  let selected = useSelected()
  const { nodeList } = useNodes()
  const node = nodeList.nodeMap.get(element.databaseId)!
  const isInDatabase = (editor.children?.[0] as any)?.type === ELEMENT_P
  const { open } = useTagDrawer()

  const menuId = `tag-menu-${genId()}`
  const { show } = useContextMenu(menuId)
  const path = findNodePath(editor, element)!

  async function clickTag() {
    if (isMobile) {
      open({
        databaseId: element.databaseId,
        path,
      })
      return
    }
    const database = await db.getNode(element.databaseId)
    if (database) {
      store.node.selectNode(database)
    }
  }

  const tagJSX = (
    <div
      contentEditable={false}
      className="text-xs leading-none px-1 flex items-center py-1 cursor-pointer font-normal"
      // bg--T92={node?.tagColor}
      // bg--T88--hover={node?.tagColor}
      // color={node?.tagColor}
      // color--D4--hover={node?.tagColor}
      onClick={clickTag}
      onContextMenu={(e) => {
        if (isInDatabase) return
        show(e)
      }}
    >
      # {node?.tagName}
    </div>
  )

  if (editor.isReadonly) {
    return (
      <div className="inline-flex bg-foreground/10 text-sm py-1 px-1 rounded ">
        # {element.name}
      </div>
    )
  }

  return (
    <span
      {...attributes}
      className={cn(
        'inline-flex items-center rounded mx-1 flex-shrink-0 overflow-hidden',
        selected && 'ring-brand-500',
      )}
      contentEditable={false}
    >
      {children}
      {tagJSX}

      <WithStoreDatabase databaseId={element.databaseId}>
        {(databaseInfo) => (
          <DatabaseProvider {...databaseInfo}>
            <ContextMenu id={menuId} w-400>
              <TagForm databaseId={element.databaseId} path={path} />
            </ContextMenu>
          </DatabaseProvider>
        )}
      </WithStoreDatabase>
    </span>
  )
}
