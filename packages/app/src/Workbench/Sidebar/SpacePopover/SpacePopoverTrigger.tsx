import { forwardRef } from 'react'
import { Box } from '@fower/react'
import { ChevronsUpDown, Settings } from 'lucide-react'
import {
  Bullet,
  Button,
  modalController,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { ModalNames, SettingsType } from '@penx/constants'
import { useActiveSpace, useSidebarDrawer } from '@penx/hooks'
import { IconSettings } from '@penx/icons'
import { store } from '@penx/store'

export const SpacePopoverTrigger = forwardRef<HTMLDivElement, {}>(
  function SpacePopoverTrigger({}, ref) {
    const { activeSpace } = useActiveSpace()
    const { close } = usePopoverContext()
    const drawer = useSidebarDrawer()

    if (!activeSpace) return null

    return (
      <PopoverTrigger asChild>
        <Box
          ref={ref}
          className="currentSpace"
          textBase
          toCenterY
          fontSemibold
          toBetween
          gap1
          bgZinc200--hover
          px2
          cursorPointer
          roundedLG
          h-36
          transitionColors
          black
          flex-1
        >
          <Box toCenterY gap1>
            <Bullet
              size={20}
              innerSize={6}
              innerColor={activeSpace?.color}
              mr1
            />
            <Box flex-1 maxW-180>
              <Box
                overflowHidden
                css={{
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                {activeSpace?.name}
              </Box>
            </Box>
            <Box gray400 flexShrink-0>
              <ChevronsUpDown
                size={12}
                style={{
                  strokeWidth: 2.5,
                }}
              />
            </Box>
          </Box>
          <Box
            inlineFlex
            // opacity-0={[false, false, true]}
            opacity-100--$currentSpace--hover
            onClick={(e) => {
              close()
              // store.router.routeTo('SPACE_SETTINGS')
              modalController.open(
                ModalNames.SETTINGS,
                SettingsType.ACCOUNT_SETTINGS,
              )
              drawer?.close?.()
              e.stopPropagation()
            }}
          >
            <Button
              size={28}
              colorScheme="gray500"
              variant="ghost"
              isSquare
              roundedFull
            >
              <IconSettings size={18} />
            </Button>
          </Box>
        </Box>
      </PopoverTrigger>
    )
  },
)
