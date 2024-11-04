import { memo, useMemo } from 'react'
import isEqual from 'react-fast-compare'
import { useEditorStatic } from '@/lib/editor-common'
import { getNodeByPath } from '@/lib/editor-queries'

import { ChevronDown } from 'lucide-react'
import { Path, Transforms } from 'slate'
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
      <div
        className="w-4 h-4 flex items-center justify-center rounded-full cursor-pointer opacity-0 border border-foreground/20"
        // opacity-100--$nodeContent--hover
        onContextMenu={onContextMenu}
        onClick={toggle}
      >
        <ChevronDown size={12} />
      </div>
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
