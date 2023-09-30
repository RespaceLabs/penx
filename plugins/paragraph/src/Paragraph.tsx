import { Box } from '@fower/react'
import { ElementProps } from '@penx/plugin-typings'

export const Paragraph = ({
  attributes,
  children,
  nodeProps,
  atomicProps,
}: ElementProps) => {
  return (
    <Box
      py1
      leadingNormal
      gray900
      textBase
      relative
      {...attributes}
      {...nodeProps}
      {...atomicProps}
    >
      {children}
    </Box>
  )
}
