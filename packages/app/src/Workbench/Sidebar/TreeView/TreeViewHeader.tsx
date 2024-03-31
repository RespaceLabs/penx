import { memo } from 'react'
import { Box } from '@fower/react'
import { Bullet } from 'uikit'
import { useActiveSpace, useSidebarDrawer } from '@penx/hooks'
import { store } from '@penx/store'
import { NewNodeButton } from './NewNodeButton'

export const TreeViewHeader = memo(function TreeViewHeader() {
  const { activeSpace } = useActiveSpace()
  const drawer = useSidebarDrawer()
  return (
    <Box
      toCenterY
      toBetween
      pl2
      pr1
      mb-1
      textBase
      fontSemibold
      cursorPointer
      bgGray200--hover
      rounded
      black
      h8
      onClick={() => {
        if (!activeSpace.isOutliner) return

        store.node.selectSpaceNode()
        drawer?.close?.()
      }}
    >
      <Box toCenterY gap2>
        <Bullet mr-4 />
        {activeSpace.isOutliner && <Box>Nodes</Box>}
        {!activeSpace.isOutliner && <Box>All pages</Box>}
      </Box>
      <NewNodeButton size={24} p1 roundedLG />
    </Box>
  )
})
