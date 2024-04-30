import { isMobile } from 'react-device-detect'
import { Box } from '@fower/react'
import { useSelected } from 'slate-react'
import { ELEMENT_P } from '@penx/constants'
import { ContextMenu, MenuItem, useContextMenu } from '@penx/context-menu'
import { DatabaseProvider } from '@penx/database-ui'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { genId } from '@penx/editor-shared'
import { ElementProps } from '@penx/extension-typings'
import { db } from '@penx/local-db'
import { useNodes } from '@penx/node-hooks'
import { store } from '@penx/store'
import { useTagDrawer } from '../../hooks/useTagDrawer'
import { TagElement } from '../../types'
import { TagForm } from './TagForm'

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
    <Box
      contentEditable={false}
      cursorPointer
      fontNormal
      // h={[24, 22]}
      py={[5, 4]}
      toCenter
      px1
      leadingNone
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

  if (editor.isReadonly) {
    return (
      <Box inlineFlex bgGray200 textXS py-2 px1 rounded>
        # {element.name}
      </Box>
    )
  }

  return (
    <Box
      {...attributes}
      as="span"
      toCenterY
      inlineFlex
      rounded
      mx-1
      flexShrink-0
      overflowHidden
      ringBrand500={selected}
      contentEditable={false}
    >
      {children}
      {tagJSX}

      {/* <DatabaseProvider databaseId={element.databaseId}>
        <ContextMenu id={menuId} w-400>
          <TagForm databaseId={element.databaseId} path={path} />
        </ContextMenu>
      </DatabaseProvider> */}
    </Box>
  )
}
