import { Box } from '@fower/react'
import { useEditorStatic } from '@penx/editor-common'
import { ElementProps } from '@penx/extension-typings'
import { TagElement } from '../types'

export const Tag = ({
  element,
  attributes,
  children,
}: ElementProps<TagElement>) => {
  const editor = useEditorStatic()

  return (
    <Box toCenterY inlineFlex {...attributes} bgGray100 py1 px1 rounded>
      {children}
      {element.name}
    </Box>
  )
}
