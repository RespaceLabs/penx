import { memo } from 'react'
import { Box } from '@fower/react'
import { Hash } from 'lucide-react'
import {
  Bullet,
  Button,
  Tag,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'uikit'
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
      textBase
      fontSemibold
      cursorPointer
      bgGray200--hover
      rounded
      black
      h8
      pr1
      brand500={isActive}
      onClick={() => {
        store.node.selectTagBox()
      }}
    >
      <Box toCenterY gap2>
        <Bullet mr-4 innerColor={isActive ? 'brand500' : undefined} />
        <Box>Meta tags</Box>
      </Box>

      <Tooltip>
        <TooltipTrigger>
          <Button
            size={24}
            variant="ghost"
            colorScheme="gray500"
            isSquare
            p1
            roundedLG
          >
            <Hash />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <Box>All tags</Box>
        </TooltipContent>
      </Tooltip>
    </Box>
  )
})
