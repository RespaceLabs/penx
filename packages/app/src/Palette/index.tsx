import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, styled } from '@fower/react'
import { Hash, Terminal, TerminalSquare } from 'lucide-react'
import { Button, InputElement, InputGroup } from 'uikit'
import { Command } from '@penx/cmdk'
import { CommandList } from './CommandList'
import { CommandWrapper } from './CommandWrapper'
import { NodeList } from './NodeList'
import { SearchByTag } from './SearchByTag'

const CommandInput = styled(Command.Input)
const StyledCommandList = styled(Command.List)

interface CommandPanelProps {
  isMobile?: boolean
}

export function CommandPanel({ isMobile = false }: CommandPanelProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLInputElement>()

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

  const close = useCallback(() => setOpen(false), [])
  const isCommand = search.startsWith('>')
  const isTag = search.startsWith('#')

  const listJSX = useMemo(() => {
    if (isCommand) {
      return <CommandList q={search} close={close} setSearch={setSearch} />
    }

    if (isTag) {
      return (
        <SearchByTag
          q={search}
          setSearch={setSearch}
          close={close}
          afterSearch={() => {
            ref.current?.focus()
          }}
        />
      )
    }

    return <NodeList q={search} setSearch={setSearch} close={close} />
  }, [isCommand, isTag, search, close, setSearch])

  return (
    <CommandWrapper
      isMobile={isMobile}
      open={open}
      setOpen={setOpen}
      setSearch={setSearch}
    >
      <InputGroup>
        <CommandInput
          ref={ref as any}
          // bgRed100
          pr--i={96}
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
          autoFocus
          value={search}
          onValueChange={(v) => {
            setSearch(v)
          }}
          onBlur={() => {
            // setSearch('')
            // TODO: This is a hack
            // setTimeout(() => {
            //   setOpen(false)
            // }, 500)
          }}
        />

        <InputElement gray500 toCenterY w-86 h-100p toRight--i pr1>
          <Button
            size={28}
            p-4--i
            isSquare
            variant="ghost"
            colorScheme="gray900"
            onClick={() => {
              setSearch('#')
              ref.current?.focus()
            }}
          >
            <Hash size={24} />
          </Button>

          <Button
            size={28}
            p-4--i
            isSquare
            variant="ghost"
            colorScheme="gray900"
            onClick={() => {
              setSearch('>')
              ref.current?.focus()
            }}
          >
            <Terminal size={24} />
          </Button>
        </InputElement>
      </InputGroup>

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
        {listJSX}
      </StyledCommandList>
      <Box h8></Box>
    </CommandWrapper>
  )
}
