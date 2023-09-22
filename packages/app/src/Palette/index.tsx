import { useEffect, useState } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { useCatalogue } from '@penx/hooks'

const CommandDialog = styled(Command.Dialog)
const CommandInput = styled(Command.Input)
const CommandList = styled(Command.List)
const CommandItem = styled(Command.Item)

export function CommandPanel() {
  const [open, setOpen] = useState(true)
  const [search, setSearch] = useState('')
  const catalogue = useCatalogue()
  const filteredItems = catalogue.docNodes.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <CommandDialog
      shadow="0 16px 70px rgba(0,0,0,.2)"
      rounded2XL
      w-640
      fixed
      top-100
      left-50p
      zIndex-10000
      translateX="-50%"
      bgWhite
      css={{
        height: 'fit-content',
      }}
      loop
      className="command-panel"
      open={open}
      onOpenChange={setOpen}
      onValueChange={(value) => {
        console.log(value)
      }}
      // onEscapeKeyDown={() => {
      //   //
      // }}
      onKeyUp={(e) => {
        // Escape goes to previous page
        // Backspace goes to previous page when search is empty
        if (e.key === 'Escape' || e.key === 'Backspace') {
          console.log('esc...')

          e.preventDefault()
        }
      }}
    >
      <CommandInput
        // bgRed100
        toCenterY
        bgTransparent
        w-100p
        h-48
        px3
        placeholderGray400
        textBase
        borderBottom
        borderGray100
        outlineNone
        placeholder="Search doc by name"
        value={search}
        onValueChange={setSearch}
        onBlur={() => {
          // setSearch('')
          // setOpen(false)
        }}
      />

      <CommandList
        maxH-400
        px2
        overflowAuto
        css={{
          transition: '100ms ease',
          transitionProperty: 'height',
          scrollPaddingBlockEnd: 40,
          overscrollBehavior: 'contain',
        }}
      >
        {!filteredItems.length && (
          <Command.Empty>No results found.</Command.Empty>
        )}

        {filteredItems.map((node) => (
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
              setOpen(false)
              catalogue.selectNode(node)
            }}
            onClick={() => {
              catalogue.selectNode(node)
            }}
          >
            {node.name}
          </CommandItem>
        ))}
      </CommandList>
      <Box>GOGO</Box>
    </CommandDialog>
  )
}
