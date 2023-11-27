import { Box } from '@fower/react'
import { LogOut, MoreHorizontal, User } from 'lucide-react'
import {
  Avatar,
  AvatarImage,
  Button,
  MenuItem,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from 'uikit'
import { useSession } from '@penx/hooks'
import { store } from '@penx/store'

export const UserProfile = () => {
  const session = useSession()
  const { close } = usePopoverContext()
  if (!session) return null

  return (
    <Box borderBottom borderGray200--T40 h-40 toCenterY pl4 pr2 toBetween>
      <Box toCenterY gap2>
        <Avatar size={24}>
          <AvatarImage src={session.user.image!} />
        </Avatar>
        <Box textSM>{session.user.email}</Box>
      </Box>
      <Popover>
        <PopoverTrigger>
          <Button isSquare variant="ghost" size={28} colorScheme="gray600">
            <MoreHorizontal size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverClose>
            <MenuItem
              gap2
              onClick={() => {
                store.routeTo('ACCOUNT_SETTINGS')
                close()
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
                // TODO:
                // signOut()
                console.log('sign out....')
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
