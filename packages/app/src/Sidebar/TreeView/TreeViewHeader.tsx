import { Box } from '@fower/react'
import { store } from '@penx/store'
import { Bullet } from '../../components/Bullet'

export function TreeViewHeader() {
  return (
    <Box
      toCenterY
      px2
      mb-1
      textSM
      fontSemibold
      gray600
      cursorPointer
      bgGray200--hover
      rounded
      h-30
      onClick={() => {
        store.selectSpaceNode()
      }}
    >
      <Bullet mr-4 />
      <Box>ALL NODES</Box>
    </Box>
  )
}
