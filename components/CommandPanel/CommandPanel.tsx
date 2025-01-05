import { useCallback, useEffect, useMemo, useState } from 'react'
import { Command } from 'cmdk'
import { CommandList } from './CommandList'
import { CommandWrapper } from './CommandWrapper'
import { CommonList } from './CommonList'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'
import { SearchDatabaseList } from './SearchDatabaseList'
import { SearchPageList } from './SearchPageList'

interface CommandPanelProps {
  isMobile?: boolean
}

export function CommandPanel({ isMobile = false }: CommandPanelProps) {
  const { open, setOpen } = useOpen()
  const { search, setSearch } = useSearch()

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
  const isPage = search.startsWith('@')

  const listJSX = useMemo(() => {
    if (isCommand) {
      return <CommandList />
    }

    if (isTag) {
      return <SearchDatabaseList />
    }

    if (isPage) {
      return <SearchPageList />
    }

    return <CommonList />
  }, [isCommand, isTag, search, close, setSearch])

  return (
    <CommandWrapper
      isMobile={isMobile}
      open={open}
      setOpen={setOpen}
      setSearch={setSearch}
    >
      <Command.Input
        className="flex items-center bg-transparent w-full h-12 px-3 placeholder-foreground/30 text-base border-b border-foreground/10 outline-none"
        placeholder="Search something..."
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

      <Command.List
        className="max-h-[400px] overflow-auto"
        style={{
          transition: '100ms ease',
          transitionProperty: 'height',
          scrollPaddingBlockEnd: 40,
          overscrollBehavior: 'contain',
        }}
      >
        {listJSX}
      </Command.List>

      {/* <Box h8></Box> */}
    </CommandWrapper>
  )
}
