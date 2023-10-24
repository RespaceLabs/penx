import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { useNodes, usePaletteDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'
import { NodeStatus } from '@penx/types'

const CommandItem = styled(Command.Item)

interface Props {
  q: string
  close: () => void
}

export function NodeList({ q, close }: Props) {
  const { nodeList } = useNodes()
  const paletteDrawer = usePaletteDrawer()

  const filteredItems = nodeList
    .find({
      where: {
        status: NodeStatus.NORMAL,
      },
      sortBy: 'openedAt',
      orderByDESC: true,
      limit: 20,
    })
    .filter((i) => i.title.toLowerCase().includes(q.toLowerCase()))

  if (!filteredItems.length) {
    return (
      <Box textSM toCenter h-64>
        No results found.
      </Box>
    )
  }

  return (
    <>
      {filteredItems.map((node) => {
        const nodeService = new NodeService(
          node,
          store.getNodes().map((n) => new Node(n)),
        )
        return (
          <CommandItem
            key={node.id}
            h10
            cursorPointer
            toCenterY
            px2
            transitionCommon
            roundedLG
            value={node.id}
            onSelect={() => {
              close()
              paletteDrawer?.close()
              nodeService.selectNode()
            }}
            onClick={() => {
              nodeService.selectNode()
              paletteDrawer?.close()
              close()
            }}
          >
            {node.title || 'Untitled'}
          </CommandItem>
        )
      })}
    </>
  )
}
