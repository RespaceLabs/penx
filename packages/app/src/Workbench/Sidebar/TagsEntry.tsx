import { memo } from 'react'
import { Box } from '@fower/react'
import { Bullet } from 'uikit'
import { store } from '@penx/store'

interface Props {
  isActive: boolean
}

export const TagsEntry = memo(function TagsEntry({ isActive }: Props) {
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
      h8
      brand500={isActive}
      onClick={() => {
        store.node.selectTagBox()
      }}
    >
      <Box toCenterY gap2>
        <Bullet mr-4 innerColor={isActive ? 'brand500' : undefined} />
        <Box>Tags</Box>
      </Box>
    </Box>
  )
})
