import { forwardRef } from 'react'
import { Box, styled } from '@fower/react'
import { Hash, Terminal } from 'lucide-react'
import { Button, InputElement, InputGroup } from 'uikit'
import { Command } from '@penx/cmdk'

const CommandInput = styled(Command.Input)

interface Props {
  search: string
  setSearch: (v: string) => void
}

export const PaletteInput = forwardRef<HTMLInputElement, Props>(
  function PaletteInput({ search, setSearch }, ref) {
    return (
      <InputGroup>
        <CommandInput
          ref={ref}
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
            p-6--i
            isSquare
            variant="ghost"
            colorScheme="gray600"
            onClick={() => {
              // onClickHash()
            }}
          >
            <Hash size={24} />
          </Button>

          <Button
            size={28}
            p-6--i
            isSquare
            variant="ghost"
            colorScheme="gray600"
            onClick={() => {
              // onClickTerminal()
            }}
          >
            <Terminal size={24} />
          </Button>
        </InputElement>
      </InputGroup>
    )
  },
)
