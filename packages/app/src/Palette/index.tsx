import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react'
import { Box } from '@fower/react'
import { CommandWrapper } from './CommandWrapper'
import { useKeyDown } from './hooks/useKeyDown'
import { PaletteContent } from './PaletteContent'
import { PaletteInput } from './PaletteInput'

interface CommandPanelProps {
  isMobile?: boolean
}

export function CommandPanel({ isMobile = false }: CommandPanelProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLInputElement>()
  const close = useCallback(() => setOpen(false), [])

  useKeyDown(() => {
    setOpen((open) => !open)
  })

  return (
    <CommandWrapper
      isMobile={isMobile}
      open={open}
      setOpen={setOpen}
      setSearch={setSearch}
    >
      <PaletteInput search={search} setSearch={setSearch} />
      <PaletteContent
        isMobile={isMobile}
        close={close}
        search={search}
        setSearch={setSearch}
        focusInput={() => {
          ref.current?.focus()
        }}
      />
      <Box h-48 borderTop borderNeutral200--T40></Box>
    </CommandWrapper>
  )
}
