import { Box } from '@fower/react'
import { ChevronsUpDown, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button, Popover, PopoverContent, PopoverTrigger } from 'uikit'
import { useSpaces } from '@penx/hooks'
import { store } from '@penx/store'
import { Bullet } from '../../../components/Bullet'
import { CreateSpaceModal } from '../../CreateSpaceModal/CreateSpaceModal'
import { QueryCloudSpaces } from './QueryCloudSpaces'
import { SpacePopoverContent } from './SpacePopoverContent'

export const SpacePopover = () => {
  const { activeSpace } = useSpaces()
  const { status, data } = useSession()

  return (
    <>
      <CreateSpaceModal />

      {status === 'authenticated' && <QueryCloudSpaces userId={data.userId} />}
      <Popover placement="bottom-start" offset={{ crossAxis: 6 }}>
        <PopoverTrigger asChild>
          {({ close }) => (
            <Box
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
              mt2
              transitionColors
              black
            >
              <Box toCenterY gap1>
                <Bullet
                  size={20}
                  innerSize={6}
                  innerColor={activeSpace.color}
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
                opacity-0
                opacity-100--$currentSpace--hover
                onClick={(e) => {
                  close()
                  store.routeTo('SPACE_SETTINGS')
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
                  <Settings size={16} />
                </Button>
              </Box>
            </Box>
          )}
        </PopoverTrigger>
        <PopoverContent w-300>
          <SpacePopoverContent />
        </PopoverContent>
      </Popover>
    </>
  )
}
