import { Box } from '@fower/react'
import { LogOut, MoreHorizontal } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import {
  Avatar,
  AvatarImage,
  Button,
  MenuItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'uikit'

export const UserProfile = () => {
  const { status, data } = useSession()

  if (status === 'unauthenticated' || !data) return null

  return (
    <Box borderBottom borderGray200--T40 h-40 toCenterY pl4 pr2 toBetween>
      <Box toCenterY gap2>
        <Avatar size={24}>
          <AvatarImage src={data.user.image!} />
        </Avatar>
        <Box textSM>{data.user.email}</Box>
      </Box>
      <Popover>
        <PopoverTrigger>
          <Button isSquare variant="ghost" size={28} colorScheme="gray600">
            <MoreHorizontal size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <MenuItem gap2 onClick={() => signOut()}>
            <Box gray500>
              <LogOut size={16} />
            </Box>
            <Box>Log out</Box>
          </MenuItem>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
