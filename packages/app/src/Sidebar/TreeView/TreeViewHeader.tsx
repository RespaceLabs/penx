import { Box } from '@fower/react'
import { store } from '@penx/store'

export function TreeViewHeader() {
  return (
    <Box
      toCenterY
      px3
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
      <Box
        className="bullet"
        mr-4
        square-15
        bgTransparent
        bgGray200
        toCenter
        roundedFull
        cursorPointer
        flexShrink-1
      >
        <Box
          square-5
          bgGray500
          roundedFull
          transitionCommon
          scale-130--$bullet--hover
        />
      </Box>
      <Box>All nodes</Box>
    </Box>
  )
}
