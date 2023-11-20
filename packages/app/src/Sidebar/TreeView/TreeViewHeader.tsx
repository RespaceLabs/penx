import { memo } from 'react'
import { Box } from '@fower/react'
import { store } from '@penx/store'
import { Bullet } from '../../components/Bullet'

export const TreeViewHeader = memo(function TreeViewHeader() {
  return (
    <Box
      toCenterY
      px2
      mb-1
      textSM
      fontSemibold
      cursorPointer
      bgGray200--hover
      rounded
      black
      h-30
      onClick={() => {
        store.selectSpaceNode()
      }}
    >
      {/* <Bullet mr-4 /> */}
      <Box>ALL NODES</Box>
    </Box>
  )
})
