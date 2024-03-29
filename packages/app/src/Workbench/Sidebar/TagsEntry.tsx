import { memo } from 'react'
import { Box } from '@fower/react'
import { Bullet } from 'uikit'
import { store } from '@penx/store'

export const TagsEntry = memo(function TagsEntry() {
  return (
    <Box
      toCenterY
      toBetween
      pl2
      pr1
      textBase
      fontSemibold
      cursorPointer
      bgGray200--hover
      rounded
      black
      h-30
      onClick={() => {
        store.node.selectTagBox()
      }}
    >
      <Box toCenterY gap2>
        <Bullet mr-4 />
        <Box>Tags</Box>
      </Box>
    </Box>
  )
})
