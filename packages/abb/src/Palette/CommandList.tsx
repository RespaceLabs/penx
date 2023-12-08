import { Dispatch, SetStateAction } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { useCommands } from '@penx/hooks'

const CommandItem = styled(Command.Item)

interface Props {
  q: string
  close: () => void
  setSearch: Dispatch<SetStateAction<string>>
}

export function CommandList({ q, close, setSearch }: Props) {
  const { commands } = useCommands()
  const search = q.replace(/^>(\s+)?/, '').toLowerCase()

  const filteredItems = commands.filter((i) => {
    if (!search) return true
    return (
      i.name.toLowerCase().includes(search) ||
      i.id.toLowerCase().includes(search)
    )
  })

  if (!filteredItems.length) {
    return (
      <Box textSM toCenter h-64>
        No results found.
      </Box>
    )
  }

  return (
    <>
      {filteredItems.map((item, i) => (
        <CommandItem
          key={item.id}
          h10
          cursorPointer
          toCenterY
          px2
          transitionCommon
          roundedLG
          value={item.id}
          onSelect={() => {
            close()
            item.handler()
            setSearch('')
          }}
          onClick={() => {
            item.handler()
            setSearch('')
          }}
        >
          {item.name}
        </CommandItem>
      ))}
    </>
  )
}
