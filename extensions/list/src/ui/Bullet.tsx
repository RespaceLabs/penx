import { memo, useMemo } from 'react'
import isEqual from 'react-fast-compare'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { extractTags, useEditor } from '@penx/editor-common'
import { Node } from '@penx/model'
import { NodeType } from '@penx/model-types'
import { nodesAtom } from '@penx/store'
import { useBulletVisible } from '../hooks/useBulletVisible'
import { ListContentElement } from '../types'

interface BulletContentProps {
  collapsed?: boolean
  nodeId?: string
  colors?: string[]
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
}

const BulletContent = memo(
  function BulletContent({
    collapsed,
    nodeId,
    colors,
    onContextMenu,
  }: BulletContentProps) {
    const editor = useEditor()

    const color = colors?.length ? colors[0] : 'gray400'

    const bgColor = useMemo(() => {
      if (!collapsed) return 'transparent'
      if (color) return `${color}--T80`
      return 'gray200'
    }, [collapsed, color])

    const bgHoverColor = useMemo(() => {
      if (color) return `${color}--T80`
      return 'gray200'
    }, [color])

    return (
      <Box
        id={`${nodeId}`}
        className="bullet"
        square={[16, 15]}
        bgTransparent
        bg--hover={bgHoverColor}
        toCenter
        roundedFull
        cursorPointer
        // flexShrink-1
        bg={bgColor}
        onContextMenu={onContextMenu}
        onClick={() => {
          editor?.onClickBullet?.(nodeId)
        }}
      >
        <Box
          square={[6, 5]}
          bg={color}
          roundedFull
          transitionCommon
          scale-130--$bullet--hover
        />
      </Box>
    )
  },
  (prev, next) =>
    prev.nodeId === next.nodeId &&
    prev.collapsed === next.collapsed &&
    isEqual(prev.colors, next.colors),
)

interface Props {
  element: ListContentElement
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
}

export const Bullet = ({ element, onContextMenu }: Props) => {
  const { collapsed = false } = element
  const isBulletVisible = useBulletVisible(element)
  const tagNames = extractTags(element.children)
  const nodes = useAtomValue(nodesAtom)

  const tagNodes = useMemo(
    () =>
      nodes.filter((n) => n.type === NodeType.DATABASE).map((n) => new Node(n)),
    [nodes],
  )

  let colors: string[] = []

  if (tagNames.length) {
    colors = tagNames.map((tagName) => {
      const find = tagNodes.find((n) => n.tagName === tagName)
      return find?.tagColor ?? 'gray400'
    })
  }

  if (!isBulletVisible) return null

  return (
    <BulletContent
      collapsed={collapsed}
      nodeId={element.id}
      colors={colors}
      onContextMenu={onContextMenu}
    />
  )
}
