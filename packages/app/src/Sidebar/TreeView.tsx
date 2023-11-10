import { Box } from '@fower/react'
import { ChevronDown } from 'lucide-react'
import { useNodes } from '@penx/hooks'
import { Node } from '@penx/model'
import { store } from '@penx/store'

interface TreeViewItemProps {
  level: number
  node: Node
}

function TreeViewItem({ node, level }: TreeViewItemProps) {
  return (
    <Box
      h-32
      toCenterY
      cursorPointer
      rounded
      bgGray200--hover
      transitionColors
      gap1
      pl={level * 12 + 8}
      onClick={() => {
        store.selectNode(node.raw)
      }}
    >
      {node.hasChildren && (
        <Box inlineFlex gray500>
          <ChevronDown size={14} />
        </Box>
      )}

      {!node.hasChildren && (
        <Box ml--6 mr-6 inlineFlex bgGray400 square-3 roundedFull></Box>
      )}

      <Box>{node.title}</Box>
    </Box>
  )
}

export const TreeView = () => {
  const { nodes, nodeList } = useNodes()

  function renderNodes(children: string[], level = 0) {
    return children.map((child, i) => {
      const node = nodeList.getNode(child)
      if (!node.children.length) {
        return <TreeViewItem key={child} node={node} level={level} />
      }

      return (
        <Box key={child} py1>
          <TreeViewItem key={child} node={node} level={level} />
          <Box>{renderNodes(node.children, level + 1)}</Box>
        </Box>
      )
    })
  }

  if (!nodes.length) return null

  return (
    <Box px3>
      <Box mb2 fontBold>
        Tree view
      </Box>
      <Box>{renderNodes(nodeList.rootNode?.children || [])}</Box>
    </Box>
  )
}
