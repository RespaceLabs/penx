import { Dispatch, SetStateAction, useMemo } from 'react'
import { Box, styled } from '@fower/react'
import { Node as SlateNode } from 'slate'
import { Command } from '@penx/cmdk'
import { getText } from '@penx/editor-queries'
import { useNodes, usePaletteDrawer } from '@penx/hooks'
import { db } from '@penx/local-db'
import { Node } from '@penx/model'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'

const CommandItem = styled(Command.Item)

interface Props {
  q: string
  setSearch: Dispatch<SetStateAction<string>>
  close: () => void
}

export function SearchByTag({ q, setSearch, close }: Props) {
  const { nodeList } = useNodes()
  const search = q.replace(/^#(\s+)?/, '') || ''

  const regex = /^(\S+)\s?(.*)?$/
  const [_, tag, text] = search.match(regex) || []

  const paletteDrawer = usePaletteDrawer()

  const filteredItems = useMemo(() => {
    if (!search) return nodeList.tagNodes

    const tagNodes = nodeList.tagNodes.filter((node) => {
      return node.tagName.includes(tag)
    })

    const canSearchALlNodesByTag = /^#(\S)+\s$/.test(q)
    if (!text && !canSearchALlNodesByTag) return tagNodes

    const database = store.node.getDatabaseByName(tag)!
    const cells = store.node
      .getCells(database.id)
      .filter((cell) => {
        const node = store.node.getNode(cell.props.ref!)
        if (!node) return false
        if (!text) return true
        const str = SlateNode.string(node.element)
        return str.toLowerCase().includes(text.toLowerCase())
      })
      .map((cell) => {
        const raw = store.node.getNode(cell.props.ref!)!
        const node = new Node(raw)
        node.raw.props.name = new Node(database).tagName
        return node
      })

    return cells
  }, [nodeList, search, tag, text, q])

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
            {node.isDatabase
              ? `#${node.tagName}`
              : `#${node.tagName} ${node.title}`}
          </CommandItem>
        )
      })}
    </>
  )
}
