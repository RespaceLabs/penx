import { memo, useMemo } from 'react'
import isEqual from 'react-fast-compare'
import { Box } from '@fower/react'
import { ChevronDown } from 'lucide-react'
import { Path, Transforms } from 'slate'
import { useEditorStatic } from '@penx/editor-common'
import { getNodeByPath } from '@penx/editor-queries'
import { isListElement } from '../guard'
import { ListContentElement } from '../types'

interface ChevronContentProps {
  collapsed: boolean
  path: Path
  nodeId: string
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
}

export const ChevronContent = memo(
  function ChevronContent({
    collapsed,
    path,
    onContextMenu,
  }: ChevronContentProps) {
    const editor = useEditorStatic()
    function toggle() {
      Transforms.setNodes<ListContentElement>(
        editor,
        { collapsed },
        { at: path },
      )
    }

    return (
      <Box
        square4
        toCenter
        roundedFull
        cursorPointer
        opacity-0
        opacity-100--$nodeContent--hover
        gray600
        border
        borderGray200
        onContextMenu={onContextMenu}
        onClick={toggle}
      >
        <ChevronDown size={12} />
      </Box>
    )
  },
  (prev, next) => {
    return prev.collapsed === next.collapsed && isEqual(prev.path, next.path)
  },
)

interface Props {
  path: Path
  collapsed: boolean
  id: string
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
}

export const Chevron = memo(
  function Chevron({ collapsed, id, path, onContextMenu }: Props) {
    const editor = useEditorStatic()

    const isChevronVisible = useMemo(() => {
      const prevPath = Path.next(path)
      const node = getNodeByPath(editor, prevPath)!
      if (isListElement(node)) return true
      return false
    }, [path, editor])

    if (!isChevronVisible) return null

    return (
      <ChevronContent
        onContextMenu={onContextMenu}
        collapsed={!collapsed}
        path={path}
        nodeId={id}
      />
    )
  },
  (prev, next) => {
    return (
      prev.collapsed === next.collapsed &&
      prev.id === next.id &&
      isEqual(prev.path, next.path)
    )
  },
)
