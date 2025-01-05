import { Command } from 'cmdk'
import { Box, styled } from '@fower/react'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'
import { useCommands } from './useCommands'

const CommandItem = styled(Command.Item)

interface Props {}

export function CommandList({}: Props) {
  const { close } = useOpen()
  const { commands } = useCommands()
  const { search, setSearch } = useSearch()
  const q = search.replace(/^>(\s+)?/, '').toLowerCase()

  const filteredItems = commands.filter((i) => {
    if (!q) return true
    // return (
    //   i.name.toLowerCase().includes(search) ||
    //   i.id.toLowerCase().includes(search)
    // )
    return true
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
          key={i}
          h10
          cursorPointer
          toCenterY
          px2
          transitionCommon
          roundedLG
          // value={item.id}
          value={'TODO'}
          onSelect={() => {
            close()
            // item.handler()
            setSearch('')
          }}
          onClick={() => {
            // item.handler()
            // setSearch('')
          }}
        >
          {/* {item.name} */}
          TODO:...
        </CommandItem>
      ))}
    </>
  )
}
