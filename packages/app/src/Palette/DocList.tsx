import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { useDocs, usePaletteDrawer } from '@penx/hooks'
import { DocService } from '@penx/service'
import { DocStatus } from '@penx/types'

const CommandItem = styled(Command.Item)

interface Props {
  q: string
  close: () => void
}

export function DocList({ q, close }: Props) {
  const { docList } = useDocs()
  const paletteDrawer = usePaletteDrawer()

  const filteredItems = docList
    .find({
      where: {
        status: DocStatus.NORMAL,
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
      {filteredItems.map((doc) => {
        const docService = new DocService(doc)
        return (
          <CommandItem
            key={doc.id}
            h10
            cursorPointer
            toCenterY
            px2
            transitionCommon
            roundedLG
            value={doc.id}
            onSelect={() => {
              close()
              paletteDrawer?.close()
              docService.selectDoc()
            }}
            onClick={() => {
              docService.selectDoc()
              paletteDrawer?.close()
              close()
            }}
          >
            {doc.title || 'Untitled'}
          </CommandItem>
        )
      })}
    </>
  )
}
