import { Box } from '@fower/react'
import { Home, LogOut, User } from 'lucide-react'
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
  if (loading) return null

  const image = session.user?.image || ''
  const name = session.user.email || session.user.name

  return (
    <Box borderBottom borderGray200--T40 h-40 toCenterY pl4 pr2 toBetween>
      <Popover>
        <PopoverTrigger>
          <Avatar size={24}>
            <AvatarImage src={image} />
            <AvatarFallback>{name}</AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <PopoverContent w-200>
          <Box toCenterY gap2 px4 py2>
            <Avatar size={24}>
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
