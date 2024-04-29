import { memo, PropsWithChildren, useMemo } from 'react'
import isEqual from 'react-fast-compare'
import { Box } from '@fower/react'
import { useAtomValue } from 'jotai'
import { Node as SlateNode } from 'slate'
import { Slate } from 'slate-react'
import {
  extractTags,
  PenxEditor,
  useEditor,
  useEditorStatic,
} from '@penx/editor-common'
import { Node } from '@penx/model'
import { NodeType } from '@penx/model-types'
import { useBulletVisible } from '../hooks/useBulletVisible'
import { ListContentElement } from '../types'

interface BulletContentProps {
  collapsed?: boolean
  nodeId?: string
  element?: ListContentElement
  colors?: string[]
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
}

const BulletContent = memo(
  function BulletContent({
    collapsed,
    nodeId,
    element,
    colors,
    onContextMenu,
  }: BulletContentProps) {
    // const editor = useEditor()
    const editor = useEditorStatic()

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
        square={[17, 15]}
        bgTransparent
        bg--hover={bgHoverColor}
        toCenter
        roundedFull
        cursorPointer
        // flexShrink-1
        bg={bgColor}
        onContextMenu={onContextMenu}
        onClick={async () => {
          editor?.onClickBullet?.(nodeId, element)
        }}
      >
        <Box
          square={[7, 5]}
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
  editor: PenxEditor
  element: ListContentElement
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
}

export const Bullet = memo(
  function Bullet({ element, onContextMenu }: Props) {
    const editor = useEditorStatic()
    const { collapsed = false } = element
    const { isBulletVisible } = useBulletVisible(element)
    const tagNames = extractTags(element.children)
    // const nodes = useAtomValue(nodesAtom)
    const nodes = editor.items.map((item) => item.raw)

    const tagNodes = useMemo(
      () =>
        nodes
          .filter((n) => n.type === NodeType.DATABASE)
          .map((n) => new Node(n)),
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
        element={element}
        colors={colors}
        onContextMenu={onContextMenu}
      />
    )
  },

  (prev, next) => {
    const equal =
      prev.element.id === next.element.id &&
      prev.element.collapsed === next.element.collapsed &&
      isEqual(SlateNode.string(prev.element), SlateNode.string(next.element)) &&
      isEqual(
        extractTags(prev.element.children),
        extractTags(next.element.children),
      )

    return equal
  },
)
