import { Cog6ToothOutline, CogSolid } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { t, Trans } from '@lingui/macro'
import { EasyModal } from 'easy-modal'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Menu,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { useSpaces } from '@penx/hooks'

export const CurrentSpace = () => {
  const { activeSpace } = useSpaces()

  return (
    <Box px4 toCenterY h-48 borderBottom borderBottomGray100 toBetween>
      <Box textXL fontBold>
        {activeSpace?.name}
      </Box>
      {/* <Popover>
        <PopoverTrigger asChild>
          <Cog6ToothOutline gray500 />
        </PopoverTrigger>
        <PopoverContent w-200>
          <PopoverClose asChild>
            <MenuItem
              onClick={() => {
                close()
                EasyModal.show(DeleteSpaceModal, spaceId)
              }}
            >
              Delete
            </MenuItem>
          </PopoverClose>
        </PopoverContent>
      </Popover> */}
    </Box>
  )
}
