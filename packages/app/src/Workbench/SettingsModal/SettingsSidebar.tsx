import { useMemo } from 'react'
import { Box, FowerHTMLProps, styled } from '@fower/react'
import { Cloud, GitCompare, LogOut, User } from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  useModalContext,
} from 'uikit'
import { SettingsType } from '@penx/constants'
import { appEmitter } from '@penx/event'
import { useSpaces, useUser } from '@penx/hooks'
import { IconPassword } from '@penx/icons'
import { useSession } from '@penx/session'

const Title = styled('div', ['gray400', 'mb4', 'textXS', 'uppercase'])

interface SidebarItemProps extends FowerHTMLProps<'div'> {
  type: any
  spaceId?: string
}

function SidebarItem({
  type = SettingsType.PREFERENCES,
  spaceId,
  ...rest
}: SidebarItemProps) {
  const { data = SettingsType.PREFERENCES, setData } = useModalContext<{
    type: SettingsType
    spaceId?: string
  }>()
  return (
    <Box
      toCenterY
      gapX2
      gray600
      textSM
      cursorPointer
      roundedXL
      py-8
      px3
      mx--12
      bgGray200--hover
      bgGray200={type === data}
      {...rest}
      onClick={() => {
        setData({ type, spaceId })
      }}
    />
  )
}

export const SettingsSidebar = () => {
  const { user } = useUser()
  const { loading, data: session } = useSession()
  const { spaces } = useSpaces()

  const name = useMemo(() => {
    if (session.user.email) return session.user.email
    if (session.user.name) return session.user.name
    if (session.address) {
      return `${session.address.slice(0, 6)}...${session.address.slice(-4)}`
    }
    return 'Unknown'
  }, [session])

  if (loading || !user) return null

  const image = session.user?.image || ''

  return (
    <Box column w={['100%', '100%', 260]} bgGray100 p6 flexShrink-0>
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
          <Box column gap-1>
            <SidebarItem type={SettingsType.ACCOUNT_SETTINGS}>
              <User size={20} />
              <Box>Account settings</Box>
            </SidebarItem>

            <SidebarItem type={SettingsType.RECOVERY_PHRASE}>
              <IconPassword size={20} />
              <Box>Recovery Phrase</Box>
            </SidebarItem>

            <SidebarItem type={SettingsType.SYNC_BACKUP}>
              <GitCompare size={20} />
              <Box>Sync & Backup</Box>
            </SidebarItem>

            <SidebarItem type={SettingsType.SYNC_SERVER}>
              <Cloud size={20} />
              <Box>Sync servers</Box>
            </SidebarItem>
          </Box>
        </Box>

        <Box py4>
          <Title>Space</Title>
          <Box column gap-1>
            {spaces.map((space) => (
              <SidebarItem
                key={space.id}
                type={SettingsType.SPACE}
                spaceId={space.id}
              >
                <Box>{space.name}</Box>
              </SidebarItem>
            ))}
          </Box>
        </Box>
      </Box>
      <Box>
        <Button
          variant="outline"
          w-100p
          colorScheme="red500"
          gap2
          display={['none', 'none', 'flex']}
          onClick={async () => {
            // await disconnectAsync()
            // disconnect()
            appEmitter.emit('SIGN_OUT')
          }}
        >
          <Box inlineFlex>
            <LogOut size={16} />
          </Box>
          <Box>Log out</Box>
        </Button>
      </Box>
    </Box>
  )
}
