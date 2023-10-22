import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'

export const Paragraph = ({
  attributes,
  children,
  nodeProps,
}: ElementProps) => {
  return (
    <Box leadingNormal gray900 textBase relative {...attributes} {...nodeProps}>
      {children}
    </Box>
  )
}
