import { Box } from '@fower/react'
import { Check, CheckSquare2, Plus, PlusIcon } from 'lucide-react'
import { Button } from 'uikit'
import { useBottomBarDrawer } from '@penx/hooks'
import { BottomBarDrawer } from './BottomBarDrawer/BottomBarDrawer'

export function BottomBar() {
  const { isOpen, close, open } = useBottomBarDrawer()
  return (
    <>
      <BottomBarDrawer />

      <Button
        display={['flex', 'flex', 'none']}
        fixed
        bottom2
        left-50p
        translateX={['-50%']}
        colorScheme="white"
        size={56}
        isSquare
        roundedFull
        shadow2XL
        bgGray200--hover
        bgGray200--active
        overflowHidden
        onClick={() => open()}
      >
        <Box gray300 inlineFlex>
          <Plus />
        </Box>
      </Button>
    </>
  )
}
