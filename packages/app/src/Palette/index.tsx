import { useEffect, useState } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { CommandList } from './CommandList'
import { CommandWrapper } from './CommandWrapper'
import { NodeList } from './NodeList'

const CommandInput = styled(Command.Input)
const StyledCommandList = styled(Command.List)

interface CommandPanelProps {
  isMobile?: boolean
}

export function CommandPanel({ isMobile = false }: CommandPanelProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

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

  const close = () => setOpen(false)
  const isCommand = search.startsWith('>')

  return (
    <CommandWrapper
      isMobile={isMobile}
      open={open}
      setOpen={setOpen}
      setSearch={setSearch}
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
        placeholder="Search node"
        value={search}
        onValueChange={(v) => {
          setSearch(v)
        }}
        onBlur={() => {
          setSearch('')
          console.log('blure...........')

          // TODO: This is a hack
          // setTimeout(() => {
          //   setOpen(false)
          // }, 500)
        }}
      />

      <StyledCommandList
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
        {!isCommand && (
          <NodeList q={search} setSearch={setSearch} close={close} />
        )}

        {isCommand && (
          <CommandList q={search} close={close} setSearch={setSearch} />
        )}
      </StyledCommandList>
      <Box h8></Box>
    </CommandWrapper>
  )
}
