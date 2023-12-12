import { memo } from 'react'
import { Box } from '@fower/react'
import { useSidebarDrawer } from '@penx/hooks'
import { store } from '@penx/store'

export const TreeViewHeader = memo(function TreeViewHeader() {
  const drawer = useSidebarDrawer()
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
        store.node.selectSpaceNode()
        drawer?.close?.()
      }}
    >
      {/* <Bullet mr-4 /> */}
      <Box>ALL NODES</Box>
    </Box>
  )
})
