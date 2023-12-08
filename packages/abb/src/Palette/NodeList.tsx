import { Dispatch, SetStateAction } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { useNodes, usePaletteDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'

const CommandItem = styled(Command.Item)

interface Props {
  q: string
  setSearch: Dispatch<SetStateAction<string>>
  close: () => void
}

export function NodeList({ q, setSearch, close }: Props) {
  const { nodeList } = useNodes()
  const paletteDrawer = usePaletteDrawer()

  const filteredItems = nodeList.nodes
    .filter(
      (node) =>
        node.title.toLowerCase().includes(q.toLowerCase()) && node.isCommon,
    )
    .slice(0, 20)

  if (!filteredItems.length) {
    return (
      <CommandItem
        h10
        cursorPointer
        toCenterY
        px2
        transitionCommon
        roundedLG
        gap2
        value="Add to node"
        onSelect={() => {
          store.node.createNodeToToday(q)
          paletteDrawer?.close()
          close()
          setSearch('')
        }}
        onClick={() => {
          store.node.createNodeToToday(q)
          paletteDrawer?.close()
          close()
          setSearch('')
        }}
      >
        <Box textSM>Add to today:</Box>
        <Box>"{q}"</Box>
      </CommandItem>
    )
  }

  return (
    <>
      {filteredItems.map((node) => {
        const nodeService = new NodeService(
          node,
          store.node.getNodes().map((n) => new Node(n)),
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
              paletteDrawer?.close()
              nodeService.selectNode()
              close()
              setSearch('')
            }}
            onClick={() => {
              nodeService.selectNode()
              paletteDrawer?.close()
              close()
              setSearch('')
            }}
          >
            {node.title || 'Untitled'}
          </CommandItem>
        )
      })}
    </>
  )
}
