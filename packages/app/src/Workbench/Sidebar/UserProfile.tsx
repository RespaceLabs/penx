import { useMemo } from 'react'
import { Box } from '@fower/react'
import { DatabaseBackup, Home, LogOut, User, Wallet } from 'lucide-react'
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
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { appEmitter } from '../../app-emitter'

export const UserProfile = () => {
  const { loading, data: session } = useSession()
  const name = useMemo(() => {
    if (session.user.email) return session.user.email
    if (session.user.name) return session.user.email
    if (session.address) {
      return `${session.address.slice(0, 6)}...${session.address.slice(-4)}`
    }
    return 'Unknown'
  }, [session])

  if (loading) return null

  const image = session.user?.image || ''

  return (
    <Box borderBottom borderGray200--T40 h-40 toCenterY pl4 pr2 toBetween>
      <Popover>
        <PopoverTrigger>
          <Avatar size={24}>
            <AvatarImage src={image} flexShrink-0 />
            <AvatarFallback>{name.slice(3, 4)}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent w-200>
          <Box toCenterY gap2 px4 py2>
            <Avatar size={24}>
              <AvatarImage src={image} />
              <AvatarFallback>{name.slice(3, 4)}</AvatarFallback>
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
                store.router.routeTo('WEB3_PROFILE')
              }}
            >
              <Box gray500>
                <Wallet size={16} />
              </Box>
              <Box>Web3 profile</Box>
            </MenuItem>
          </PopoverClose>

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
              onClick={() => {
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
    </Box>
  )
}
