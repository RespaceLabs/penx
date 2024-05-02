import { Dispatch, SetStateAction, useMemo } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { usePaletteDrawer } from '@penx/hooks'
import { Node } from '@penx/model'
import { useNodes } from '@penx/node-hooks'
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
  afterSearch?: () => void
}

export function SearchByTag({ q, setSearch, afterSearch, close }: Props) {
  const { nodeList } = useNodes()
  const tagName = q.replace(/^#(\s+)?/, '') || ''
  const paletteDrawer = usePaletteDrawer()

  const filteredItems = useMemo(() => {
    if (q === '#') {
      return nodeList.tagNodes.filter(filterBuiltin)
    }

    return nodeList.tagNodes
      .filter((node) => node.tagName.includes(tagName))
      .filter(filterBuiltin)
      .sort((a, b) => {
        if (b.tagName.startsWith(tagName)) return 1
        return -1
      })
  }, [nodeList, q, tagName])

  if (!filteredItems.length) {
    return (
      <Box textSM toCenter h-64>
        No results found.
      </Box>
    )
  }

  return (
    <>
      {filteredItems.slice(0, 20).map((database, index) => {
        const onSelect = () => {
          if (tagName === database.tagName) {
            store.node.selectNode(database.raw)
          } else {
            setSearch('#' + database.tagName)
            afterSearch?.()
            return
          }

          paletteDrawer?.close()
          close()
          setSearch('')
        }

        return (
          <CommandItem
            key={index}
            h10
            cursorPointer
            toCenterY
            px2
            roundedLG
            gap1
            onSelect={() => {
              onSelect()
            }}
            onClick={() => {
              onSelect()
            }}
          >
            {`#${database.tagName}`}
          </CommandItem>
        )
      })}
    </>
  )
}
