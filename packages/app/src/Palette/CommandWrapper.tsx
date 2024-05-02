import { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { useValue } from './hooks/useValue'

const CommandDialog = styled(Command.Dialog)
const StyledCommand = styled(Command)

interface CommandWrapperProps {
  isMobile?: boolean
  open: boolean
  setSearch: Dispatch<SetStateAction<string>>
  setOpen: (open: boolean) => void
}

export const CommandWrapper = ({
  children,
  isMobile,
  open,
  setOpen,
  setSearch,
}: PropsWithChildren<CommandWrapperProps>) => {
  const { value, setValue } = useValue()
  if (isMobile) {
    return (
      <StyledCommand
        w-100p
        left-50p
        bgWhite
        css={{
          height: 'fit-content',
        }}
        loop
        className="command-panel"
        value={value}
        onValueChange={(v) => setValue(v)}
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
      w={['90%', '90%', 760]}
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
      value={value}
      onValueChange={(v) => setValue(v)}
      onEscapeKeyDown={() => {
        setSearch('')
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
