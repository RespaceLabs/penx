import { PropsWithChildren, useEffect, useState } from 'react'
import { Box, styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { CommandList } from './CommandList'
import { NodeList } from './NodeList'

const CommandDialog = styled(Command.Dialog)
const CommandInput = styled(Command.Input)
const StyledCommandList = styled(Command.List)
const StyledCommand = styled(Command)

interface WrapperProps {
  isMobile?: boolean
  open: boolean
  setOpen: (open: boolean) => void
}

const Wrapper = ({
  children,
  isMobile,
  open,
  setOpen,
}: PropsWithChildren<WrapperProps>) => {
  if (isMobile) {
    return (
      <StyledCommand
        bgRed100
        w-100p
        left-50p
        bgWhite
        css={{
          height: 'fit-content',
        }}
        loop
        className="command-panel"
        onValueChange={(value) => {
          console.log(value)
        }}
        onKeyUp={(e) => {
          // Escape goes to previous page
          // Backspace goes to previous page when search is empty
          if (e.key === 'Escape' || e.key === 'Backspace') {
            e.preventDefault()
          }
        }}
      >
        {children}
      </StyledCommand>
    )
  }
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
      onEscapeKeyDown={() => {
        //
      }}
      onKeyUp={(e) => {
        // Escape goes to previous page
        // Backspace goes to previous page when search is empty
        if (e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault()
        }
      }}
    >
      {children}
    </CommandDialog>
  )
}

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
    <Wrapper isMobile={isMobile} open={open} setOpen={setOpen}>
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
        placeholder="Search node by name"
        value={search}
        onValueChange={(v) => {
          setSearch(v)
        }}
        onBlur={() => {
          setSearch('')
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
    </Wrapper>
  )
}
