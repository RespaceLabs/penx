import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { FileContainerElement } from '../types'

export const FileContainer = ({
  attributes,
  children,
}: ElementProps<FileContainerElement>) => {
  return (
    <Box my2 {...attributes}>
      {children}
    </Box>
  )
}
