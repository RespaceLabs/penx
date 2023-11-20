import { Path, Transforms } from 'slate'
import { ContextMenu, MenuItem } from '@penx/context-menu'
import { useEditorStatic } from '@penx/editor-common'
import { findNodePath } from '@penx/editor-queries'
import { store } from '@penx/store'
import { ListContentElement } from '../types'

interface Props {
  menuId: string
  element: ListContentElement
}

export const BulletMenu = ({ menuId, element }: Props) => {
  const editor = useEditorStatic()
  const path = findNodePath(editor, element)!

  function handleItemClick(type: string) {
    if (type === 'DELETE') {
      Transforms.removeNodes(editor, { at: Path.parent(path) })
    }
  }

  function openInNewPanel() {
    const nodes = store.getNodes()
    const node = nodes.find((n) => n.id === element.id)!
    const activeNodes = store.getActiveNodes()
    store.setActiveNodes([...activeNodes, node])
  }

  return (
    <ContextMenu id={menuId}>
      <MenuItem onClick={() => handleItemClick('a')}>Add to favorite</MenuItem>
      <MenuItem onClick={openInNewPanel}>Open in new panel</MenuItem>
      <MenuItem onClick={() => handleItemClick('b')}>Publish</MenuItem>
      <MenuItem onClick={() => handleItemClick('c')}>Copy</MenuItem>
      <MenuItem onClick={() => handleItemClick('DELETE')}>Delete</MenuItem>
      <MenuItem onClick={() => handleItemClick('d')}>Expand all</MenuItem>
      <MenuItem onClick={() => handleItemClick('f')}>Collapse all</MenuItem>
    </ContextMenu>
  )
}
