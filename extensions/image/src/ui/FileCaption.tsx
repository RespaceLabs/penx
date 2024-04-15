import { Box } from '@fower/react'
import { ElementProps } from '@penx/extension-typings'
import { FileCaptionElement } from '../types'

export const FileCaption = ({
  attributes,
  children,
  element,
}: ElementProps<FileCaptionElement>) => {
  return (
    <Box textSM gray400 py1 {...attributes}>
      {children}
    </Box>
  )
}
