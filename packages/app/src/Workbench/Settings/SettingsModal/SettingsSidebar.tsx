import { useMemo } from 'react'
import { isMobile } from 'react-device-detect'
import { Box, FowerHTMLProps, styled } from '@fower/react'
import {
  ChevronRightIcon,
  Cloud,
  GitCompare,
  Key,
  LogOut,
  User,
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  useModalContext,
} from 'uikit'
import { isSyncEnabled, SettingsType } from '@penx/constants'
import { appEmitter } from '@penx/event'
import { useSettingDrawer, useSpaces, useUser } from '@penx/hooks'
import { IconPassword } from '@penx/icons'
import { useSession } from '@penx/session'
import { MotionBox } from '@penx/widget'

const Title = styled('div', ['gray400', 'mb3', 'textXS', 'uppercase'])

interface SectionProps extends FowerHTMLProps<'div'> {}
function Section({ children, ...rest }: SectionProps) {
  return (
    <Box
      bg={['white', 'transparent']}
      overflowHidden={isMobile}
      roundedXL
      {...rest}
    >
      {children}
    </Box>
  )
}

interface SidebarItemProps extends FowerHTMLProps<'div'> {
  type: any
  spaceId?: string
}

function SidebarItem({
  type = SettingsType.PREFERENCES,
  spaceId,
  children,
  ...rest
}: SidebarItemProps) {
  const { data = SettingsType.PREFERENCES, setData } = useModalContext<{
    type: SettingsType
    spaceId?: string
  }>()

  const settingDrawer = useSettingDrawer()

  return (
    <MotionBox
      toCenterY
      toBetween
      gray600
      textSM
      cursorPointer
      rounded={[0, 8]}
      py={[12, 8]}
      px={[16, 12]}
      mx={[0, 0, -12]}
      bgGray200--hover={!isMobile}
      bgGray200={type === data}
      borderBottom
      borderColor={['neutral100', 'transparent']}
      selectNone
      whileTap={{
        opacity: 0.5,
      }}
      {...(rest as any)}
      onClick={() => {
        if (isMobile) {
          settingDrawer.open(type, spaceId!)
          return
        }
        setData({ type, spaceId })
      }}
    >
      <Box toCenterY gapX2>
        {children}
      </Box>

      <Box inlineFlex mr--8 display={['inline-flex', 'none']}>
        <ChevronRightIcon size={20} />
      </Box>
    </MotionBox>
  )
}

export const SettingsSidebar = () => {
  const { loading, data: session } = useSession()
  const { spaces } = useSpaces()

  const name = useMemo(() => {
    if (!session) return ''
    if (session.user.email) return session.user.email
    if (session.user.name) return session.user.name
    if (session.address) {
      return `${session.address.slice(0, 6)}...${session.address.slice(-4)}`
    }
    return 'Unknown'
  }, [session])

  if (loading) return null

  const image = session?.user?.image || ''

  return (
    <Box
      column
      w={['100%', '100%', 260]}
      bgGray100
      p={[20, 20, 24]}
      // flexShrink-0
      flex-1={isMobile}
    >
      <Box flex-1>
        <Box toCenterY gap2 py2>
          <Avatar size={24} flexShrink-0>
            <AvatarImage src={image} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <Box textSM>{name}</Box>
        </Box>
        <Box py4>
          <Title>General</Title>
          <Section column gap-1>
            <SidebarItem type={SettingsType.ACCOUNT_SETTINGS}>
              <User size={20} />
              <Box>Account settings</Box>
            </SidebarItem>

            <SidebarItem type={SettingsType.RECOVERY_PHRASE}>
              {/* <IconPassword size={20} /> */}
              <Key size={20} />
              <Box>Recovery Phrase</Box>
            </SidebarItem>

            <SidebarItem type={SettingsType.SYNC_BACKUP}>
              <GitCompare size={20} />
              <Box>Google drive backup</Box>
            </SidebarItem>

            {isSyncEnabled && (
              <SidebarItem type={SettingsType.SYNC_SERVER} borderTransparent>
                <Cloud size={20} />
                <Box>Sync servers</Box>
              </SidebarItem>
            )}
          </Section>
        </Box>

        <Box py4>
          <Title>Space</Title>
          <Section column gap-1>
            {spaces.map((space, index) => (
              <SidebarItem
                key={space.id}
                type={SettingsType.SPACE}
                spaceId={space.id}
                borderTransparent={spaces.length - 1 === index}
              >
                <Box>{space.name}</Box>
              </SidebarItem>
            ))}
          </Section>
        </Box>
      </Box>
      <Box>
        <Button
          variant="ghost"
          w-100p
          colorScheme="red500"
          gap2
          // display={['none', 'none', 'flex']}
          onClick={async () => {
            // await disconnectAsync()
            // disconnect()
            appEmitter.emit('SIGN_OUT')
          }}
        >
          <Box inlineFlex>
            <LogOut size={16} />
          </Box>
          <Box>Sign out</Box>
        </Button>
      </Box>
    </Box>
  )
}
