import { Box } from '@fower/react'
import { useFocused, useSelected } from 'slate-react'
import { ElementProps } from '@penx/extension-typings'

export const Divider = ({ attributes, children }: ElementProps) => {
  const selected = useSelected()
  const active = selected

  return (
    <Box {...attributes} cursorPointer toCenterY h8 w-100p>
      <Box flex-1 h={active ? 2 : 1} bgGray200={!active} bgBrand500={active}>
        {children}
      </Box>
    </Box>
  )
}
