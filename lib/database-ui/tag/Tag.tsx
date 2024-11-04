import { ELEMENT_P } from '@/lib/constants'
import { ContextMenu, MenuItem, useContextMenu } from '@/lib/context-menu'
// import { TagElement } from '../../types'
import { DatabaseProvider, WithStoreDatabase } from '@/lib/database-context'
import { useEditorStatic } from '@/lib/editor-common'
import { findNodePath } from '@/lib/editor-queries'
import { genId } from '@/lib/editor-shared'
import { ElementProps } from '@/lib/extension-typings'
import { db } from '@/lib/local-db'
import { useNodes } from '@/lib/node-hooks'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { useSelected } from 'slate-react'
import { TagForm } from './TagForm'

export const Tag = ({ element, attributes, children }: ElementProps<any>) => {
  const editor = useEditorStatic()

  let selected = useSelected()
  const { nodeList } = useNodes()
  const node = nodeList.nodeMap.get(element.databaseId)!
  const isInDatabase = (editor.children?.[0] as any)?.type === ELEMENT_P

  const menuId = `tag-menu-${genId()}`
  const { show } = useContextMenu(menuId)

  async function clickTag() {
    const database = await db.getNode(element.databaseId)
    if (database) {
      store.node.selectNode(database)
    }
  }

  const path = findNodePath(editor, element)!

  const tagJSX = (
    <div
      contentEditable={false}
      className="cursor-pointer font-normal py-1 px-1 leading-none text-xs"
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
      <div className="inline-flex bg-foreground/20 text-xs py-[2px] px-1 rounded">
        # {element.name}
      </div>
    )
  }

  return (
    <div
      {...attributes}
      className={cn(
        'inline-flex items-center bg-foreground/10 rounded mx-[1px] overflow-hidden',
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
    </div>
  )
}
