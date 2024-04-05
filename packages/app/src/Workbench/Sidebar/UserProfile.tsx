import { useMemo } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import {
  DatabaseBackup,
  GitCompare,
  Home,
  LogOut,
  User,
  Wallet,
} from 'lucide-react'
import { useDisconnect } from 'wagmi'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'
import { appEmitter } from '@penx/event'
import { useUser } from '@penx/hooks'
import { useSession } from '@penx/session'
import { store } from '@penx/store'

interface Props extends FowerHTMLProps<'div'> {
  isMobile?: boolean
}

export const UserProfile = ({ isMobile, ...rest }: Props) => {
  const { user } = useUser()

  // const { disconnect, disconnectAsync } = useDisconnect()
  const { loading, data: session } = useSession()

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

  // <Box toCenterY pl4 pr2></Box>
  return (
    <Popover>
      <PopoverTrigger>
        {!isMobile && (
          <Avatar size={24} {...rest}>
            <AvatarImage src={image} flexShrink-0 />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        )}

        {isMobile && (
          <Box toCenterY gap2 {...rest}>
            <Avatar size={32}>
              <AvatarImage src={image} flexShrink-0 />
              <AvatarFallback>{name}</AvatarFallback>
            </Avatar>
          </Box>
        )}
      </PopoverTrigger>
      <PopoverContent w-220>
        <Box toCenterY gap2 px4 py2>
          <Avatar size={24} flexShrink-0>
            <AvatarImage src={image} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
          <Box textSM>{name}</Box>
        </Box>

        <PopoverClose>
          <MenuItem
            gap2
            onClick={() => {
              store.router.routeTo('ACCOUNT_SETTINGS')
            }}
          >
            <Box gray500>
              <User size={16} />
            </Box>
            <Box>Account settings</Box>
          </MenuItem>
        </PopoverClose>

        <PopoverClose>
          <MenuItem
            gap2
            onClick={() => {
              store.router.routeTo('RECOVERY_PHRASE')
            }}
          >
            <Box gray500>
              <User size={16} />
            </Box>
            <Box>Recovery Phrase</Box>
          </MenuItem>
        </PopoverClose>

        <PopoverClose>
          <MenuItem
            gap2
            onClick={() => {
              store.router.routeTo('VERSION_CONTROL')
            }}
          >
            <Box gray500>
              <GitCompare size={16} />
            </Box>
            <Box>GitHub backup</Box>
          </MenuItem>
        </PopoverClose>

        {/* <PopoverClose>
            <MenuItem
              gap2
              onClick={() => {
                store.router.routeTo('WEB3_PROFILE')
              }}
            >
              <Box gray500>
                <Wallet size={16} />
              </Box>
              <Box>Web3 profile</Box>
            </MenuItem>
          </PopoverClose> */}

        {user?.isAdmin && (
          <PopoverClose>
            <MenuItem
              gap2
              onClick={() => {
                store.router.routeTo('TASK_BOARD')
              }}
            >
              <Box gray500>
                <DatabaseBackup size={16} />
              </Box>
              <Box>Task board</Box>
            </MenuItem>
          </PopoverClose>
        )}

        <PopoverClose>
          <MenuItem
            gap2
            onClick={() => {
              store.router.routeTo('SYNC_SERVER')
            }}
          >
            <Box gray500>
              <DatabaseBackup size={16} />
            </Box>
            <Box>Sync servers</Box>
          </MenuItem>
        </PopoverClose>

        <PopoverClose>
          <MenuItem
            gap2
            onClick={async () => {
              // await disconnectAsync()
              // disconnect()
              appEmitter.emit('SIGN_OUT')
            }}
          >
            <Box gray500>
              <LogOut size={16} />
            </Box>
            <Box>Log out</Box>
          </MenuItem>
        </PopoverClose>
      </PopoverContent>
    </Popover>
  )
}
