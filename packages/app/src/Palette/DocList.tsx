import { useEffect, useState } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { DocService } from '@penx/domain'
import { db, IDoc } from '@penx/local-db'

const CommandItem = styled(Command.Item)

interface Props {
  q: string
  close: () => void
}

export function DocList({ q, close }: Props) {
  const [docs, setDocs] = useState<IDoc[]>([])

  useEffect(() => {
    db.doc
      .select({
        sortBy: 'openedAt',
        orderByDESC: true,
      })
      .then((docs = []) => {
        setDocs(docs)
      })
  }, [])

  const filteredItems = docs.filter((i) =>
    i.title.toLowerCase().includes(q.toLowerCase()),
  )

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
              docService.selectDoc()
            }}
            onClick={() => {
              docService.selectDoc()
            }}
          >
            {doc.title}
          </CommandItem>
        )
      })}
    </>
  )
}
