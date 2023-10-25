import { memo } from 'react'
import { Box } from '@fower/react'
import { useEditor } from '@penx/editor-common'

const ClickablePadding = () => {
  const editor = useEditor()

  return (
    <Box
      className="clickable-padding"
      minH-200
      cursorText
      onClick={(e) => {
        //
      }}
    />
  )
}

export default memo(ClickablePadding)
