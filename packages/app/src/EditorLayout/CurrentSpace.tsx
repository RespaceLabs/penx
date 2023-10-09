import { Cog6ToothOutline, CogSolid } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { t, Trans } from '@lingui/macro'
import { EasyModal } from 'easy-modal'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  Avatar,
  AvatarFallback,
  Menu,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { useSpaces } from '@penx/hooks'
import { CreateSpaceModal } from './CreateSpaceModal'
import { SpaceList } from './SpaceList'

export const CurrentSpace = () => {
  const { activeSpace } = useSpaces()

  return (
    <>
      <CreateSpaceModal />
      <Popover offset={{ crossAxis: 10 }}>
        <PopoverTrigger asChild>
          <Box
            textXL
            fontBold
            toCenterY
            gap2
            bgZinc200--hover
            px2
            py4
            cursorPointer
            rounded2XL
            mx4
            my2
          >
            <Avatar>
              <AvatarFallback>{activeSpace?.name}</AvatarFallback>
            </Avatar>
            <Box>{activeSpace?.name}</Box>
          </Box>
        </PopoverTrigger>
        <PopoverContent w-300>
          <SpaceList />
        </PopoverContent>
      </Popover>
    </>
  )
}
