import { Dispatch, SetStateAction } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { usePaletteDrawer } from '@penx/hooks'
import { useNodes } from '@penx/node-hooks'
import { store } from '@penx/store'
import { NodeItem } from './NodeItem'

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
    .filter((node) => {
      if (!node.title) return false

      return node.title.toLowerCase().includes(q.toLowerCase()) && node.isCommon
    })
    .slice(0, 20)

  if (!filteredItems.length) {
    return (
      <CommandItem
        cursorPointer
        toCenterY
        px2
        py3
        roundedLG
        gap2
        value="Add to node"
        onSelect={() => {
          store.node.addTextToToday(q)
          paletteDrawer?.close()
          close()
          setSearch('')
        }}
        onClick={() => {
          store.node.addTextToToday(q)
          paletteDrawer?.close()
          close()
          setSearch('')
        }}
      >
        <Box textSM>Add to today:</Box>
        <Box>{`"${q}"`}</Box>
      </CommandItem>
    )
  }

  return (
    <>
      {filteredItems.map((node) => {
        return (
          <NodeItem
            key={node.id}
            node={node}
            onSelect={() => {
              paletteDrawer?.close()
              store.node.selectNode(node.raw)
              close()
              setSearch('')
            }}
          />
        )
      })}
    </>
  )
}
