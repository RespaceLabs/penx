import { Box } from '@fower/react'
import { useSelected } from 'slate-react'
import { ELEMENT_P } from '@penx/constants'
import { ContextMenu, MenuItem, useContextMenu } from '@penx/context-menu'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { genId } from '@penx/editor-shared'
import { ElementProps } from '@penx/extension-typings'
import { useNodes } from '@penx/hooks'
import { db } from '@penx/local-db'
import { store } from '@penx/store'
import { TagElement } from '../../types'
import { DatabaseProvider } from '../DatabaseContext'
import { TagForm } from './TagForm'

export const Tag = ({
  element,
  attributes,
  children,
}: ElementProps<TagElement>) => {
  let selected = useSelected()
  const { nodeList } = useNodes()
  const node = nodeList.nodeMap.get(element.databaseId)!
  const editor = useEditorStatic()
  const isInDatabase = (editor.children?.[0] as any)?.type === ELEMENT_P

  const menuId = `tag-menu-${genId()}`
  const { show } = useContextMenu(menuId)

  async function clickTag() {
    const database = await db.getNode(element.databaseId)
    if (database) {
      console.log('=====database:', database)
      store.node.selectNode(database)
    }
  }

  const path = findNodePath(editor, element)!

  const tagJSX = (
    <Box
      contentEditable={false}
      cursorPointer
      fontNormal
      py1
      px1
      textXS
      bg--T92={node?.tagColor}
      bg--T88--hover={node?.tagColor}
      color={node?.tagColor}
      color--D4--hover={node?.tagColor}
      onClick={clickTag}
      onContextMenu={(e) => {
        if (isInDatabase) return
        show(e)
      }}
    >
      # {node?.tagName}
    </Box>
  )

  return (
    <Box
      {...attributes}
      toCenterY
      inlineFlex
      bgGray100
      rounded
      overflowHidden
      ringBrand500={selected}
      contentEditable={false}
    >
      {children}
      {tagJSX}

      <DatabaseProvider databaseId={element.databaseId}>
        <ContextMenu id={menuId} w-400>
          <TagForm databaseId={element.databaseId} path={path} />
        </ContextMenu>
      </DatabaseProvider>
    </Box>
  )
}
