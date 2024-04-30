import { Dispatch, SetStateAction, useMemo } from 'react'
import { Box, styled } from '@fower/react'
import { Node as SlateNode } from 'slate'
import { modalController } from 'uikit'
import { Command } from '@penx/cmdk'
import { ModalNames } from '@penx/constants'
import { usePaletteDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { IDatabaseNode } from '@penx/model-types'
import { useNodes } from '@penx/node-hooks'
import { NodeService } from '@penx/service'
import { store } from '@penx/store'

const CommandItem = styled(Command.Item)

const filterBuiltin = (node: Node) => {
  if (node.isTodoDatabase) return false
  if (node.isFileDatabase) return false
  if (node.tagName.startsWith('$template_')) return false
  return true
}

interface Props {
  q: string
  setSearch: Dispatch<SetStateAction<string>>
  close: () => void
}

interface Item {
  node: Node
  database: IDatabaseNode
}

export function SearchByTag({ q, setSearch, close }: Props) {
  const { nodeList } = useNodes()
  const search = q.replace(/^#(\s+)?/, '') || ''

  const regex = /^(\S+)\s?(.*)?$/
  const [_, tag, text = ''] = search.match(regex) || []

  const paletteDrawer = usePaletteDrawer()

  const filteredItems = useMemo(() => {
    if (!search) {
      return nodeList.tagNodes.filter(filterBuiltin)
    }

    const tagNodes = nodeList.tagNodes.filter((node) => {
      return node.tagName.includes(tag)
    })

    const canSearchALlNodesByTag = /^#(\S)+\s$/.test(q)
    if (!text && !canSearchALlNodesByTag) {
      return tagNodes.filter(filterBuiltin)
    }

    const database = store.node.getDatabaseByName(tag)!

    if (!database) return nodeList.tagNodes.filter(filterBuiltin)

    const cells = store.node
      .getCells(database.id)
      .filter((cell) => {
        // first try to match the ref
        const node = store.node.getNode(cell.props.ref!)

        if (!node) {
          const { data = '' } = cell.props

          // try to match others cell data
          if (data) {
            return String(data).toLowerCase().includes(text.toLowerCase())
          }

          return false
        }

        if (!text) return true

        const str = SlateNode.string(node.element[0])
        const matched = str.toLowerCase().includes(text.toLowerCase())

        return matched
      })
      .map((cell) => {
        const raw = store.node.getNode(cell.props.ref!) || cell
        const node = new Node(raw)

        // set name for render
        node.raw.props.name = new Node(database).tagName
        node.raw.props.rowId = cell.props.rowId

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

        const onSelect = () => {
          if (node.isDatabase) {
            if (search === node.tagName) {
              nodeService.selectNode()
            } else {
              setSearch('#' + node.tagName)
              return
            }
          } else {
            const database = store.node.getDatabaseByName(node.tagName)!

            // console.log('=======database:', database)

            modalController.open(ModalNames.ROW, {
              node,
              databaseId: database.id,
            })
          }

          paletteDrawer?.close()
          close()
          setSearch('')
        }

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
              onSelect()
            }}
            onClick={() => {
              onSelect()
            }}
          >
            {node.isDatabase
              ? `#${node.tagName}`
              : `#${node.tagName} ${node.isCell ? String(node.props.data) : node.title}`}
          </CommandItem>
        )
      })}
    </>
  )
}
