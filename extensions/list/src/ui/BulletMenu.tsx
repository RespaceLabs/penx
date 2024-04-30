import { memo } from 'react'
import isEqual from 'react-fast-compare'
import { Path, Transforms } from 'slate'
import { toast } from 'uikit'
import { ContextMenu, MenuItem } from '@penx/context-menu'
import { useEditorStatic } from '@penx/editor-common'
import { NodeType } from '@penx/model-types'
import { useCopyToClipboard } from '@penx/shared'
import { store } from '@penx/store'

interface Props {
  menuId: string
  path: Path
  nodeType: NodeType
  id: string
}

export const BulletMenu = memo(
  function BulletMenu({ menuId, path, nodeType, id }: Props) {
    const editor = useEditorStatic()
    const { copy } = useCopyToClipboard()

    function handleItemClick(type: string) {
      if (type === 'DELETE') {
        if (nodeType === NodeType.DATABASE) {
          toast.warning('Can not delete database node')
        } else {
          Transforms.removeNodes(editor, { at: Path.parent(path) })
        }
      }
    }

    function copyNodeId() {
      copy(id)
      toast.info('Copied to clipboard')
    }

    function copyNode() {
      console.log('copy node.....')
      editor.copiedNodeId = id
    }

    async function openInNewPanel() {
      await store.node.openInNewPanel(id)
    }

    return (
      <ContextMenu id={menuId}>
        {/* <MenuItem onClick={() => handleItemClick('a')}>Add to favorite</MenuItem> */}
        {/* <MenuItem onClick={openInNewPanel}>Open in new panel</MenuItem> */}
        {/* <MenuItem onClick={() => handleItemClick('b')}>Publish</MenuItem> */}
        <MenuItem onClick={copyNodeId}>Copy node ID</MenuItem>
        <MenuItem onClick={copyNode}>Copy</MenuItem>
        <MenuItem onClick={() => handleItemClick('DELETE')}>Delete</MenuItem>
        {/* <MenuItem onClick={() => handleItemClick('d')}>Expand all</MenuItem> */}
        {/* <MenuItem onClick={() => handleItemClick('d')}> Collapse all</MenuItem> */}
      </ContextMenu>
    )
  },
  (prev, next) => {
    return (
      prev.menuId === next.menuId &&
      prev.id === next.id &&
      isEqual(prev.path, next.path) &&
      prev.nodeType === next.nodeType
    )
  },
)
