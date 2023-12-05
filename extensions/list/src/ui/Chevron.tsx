import { memo, useMemo } from 'react'
import { Box } from '@fower/react'
import { ChevronDown } from 'lucide-react'
import { Node, Path, Transforms } from 'slate'
import { useEditor, useEditorStatic } from '@penx/editor-common'
import { findNodePath, getNodeByPath } from '@penx/editor-queries'
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
  (prev, next) => JSON.stringify(prev) === JSON.stringify(next),
)

interface Props {
  element: ListContentElement
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
}

export const Chevron = ({ element, onContextMenu }: Props) => {
  const editor = useEditorStatic()
  const path = findNodePath(editor, element)!

  // console.log('render.......', Node.string(element))

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
      collapsed={!element.collapsed}
      path={path}
      nodeId={element.id}
    />
  )
}
