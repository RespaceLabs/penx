import { memo } from 'react'
import { Box } from '@fower/react'
import { useSlate } from 'slate-react'

const ClickablePadding = () => {
  const editor = useSlate()

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
