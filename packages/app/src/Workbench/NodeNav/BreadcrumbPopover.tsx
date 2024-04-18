import { useMemo } from 'react'
import { Box } from '@fower/react'
import { ChevronRight } from 'lucide-react'
import { Node as SlateNode } from 'slate'
import {
  Bullet,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { Node } from '@penx/model'
import { useNodes } from '@penx/node-hooks'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'

interface Props {
  node: Node
}

export const BreadcrumbPopover = ({ node }: Props) => {
  const { nodes } = useNodes()
  const nodeService = useMemo(() => new NodeService(node, nodes), [node, nodes])

  return (
    <Popover placement="bottom-start">
      <PopoverTrigger asChild>
        <Box
          gray500
          toCenterY
          mb--2
          circle-16
          bgGray200--T40
          bgGray200--hover
          toCenter
          cursorPointer
          transitionCommon
        >
          <ChevronRight size={14} />
        </Box>
      </PopoverTrigger>
      <PopoverContent w-200 column>
        {nodeService.childrenNodes.map((item) => {
          if (!item?.raw?.element?.[0]) return null
          if (!SlateNode.string(item.element[0])) return null
          return (
            <MenuItem
              gap2
              key={item.id}
              onClick={() => store.node.selectNode(item.raw)}
            >
              <Bullet />
              <Box>{item.title}</Box>
            </MenuItem>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}
