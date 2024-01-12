import { memo } from 'react'
import { Box } from '@fower/react'
import { Bullet } from 'uikit'
import { useSidebarDrawer, useSpaces } from '@penx/hooks'
import { store } from '@penx/store'
import { NewNodeButton } from './NewNodeButton'

export const TreeViewHeader = memo(function TreeViewHeader() {
  const { activeSpace } = useSpaces()
  const drawer = useSidebarDrawer()
  return (
    <Box
      toCenterY
      toBetween
      pl2
      pr1
      mb-1
      textSM
      fontSemibold
      cursorPointer
      bgGray200--hover
      rounded
      black
      h-30
      onClick={() => {
        if (!activeSpace.isOutliner) return

        store.node.selectSpaceNode()
        drawer?.close?.()
      }}
    >
      <Box toCenterY gap2>
        <Bullet mr-4 />
        {activeSpace.isOutliner && <Box>ALL NODES</Box>}
        {!activeSpace.isOutliner && <Box>ALL PAGES</Box>}
      </Box>
      <NewNodeButton size={24} p1 roundedLG />
    </Box>
  )
})
