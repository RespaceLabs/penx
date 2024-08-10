'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAddress } from '@/hooks/useAddress'
import { useCreatePost } from '@/hooks/useCreatePost'
import { PostWithSpace } from '@/hooks/usePost'
import { useSpaces } from '@/hooks/useSpaces'
import { GateType } from '@/lib/constants'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import {
  Cat,
  Cloud,
  CreditCard,
  Feather,
  Gauge,
  Github,
  Headphones,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  UserRoundPen,
  Users,
  Users2,
  Video,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Props {}

export function NewButton({}: Props) {
  const { push } = useRouter()
  const createPost = useCreatePost()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="rounded-full w-8 h-8">
          <Plus></Plus>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={async () => {
              await createPost()
            }}
          >
            <Feather className="mr-2 h-4 w-4" />
            <span>New article</span>
          </DropdownMenuItem>

          <DropdownMenuItem disabled className="cursor-pointer">
            <Cat className="mr-2 h-4 w-4" />
            <span>New NFT</span>
          </DropdownMenuItem>

          <DropdownMenuItem disabled className="cursor-pointer">
            <Headphones className="mr-2 h-4 w-4" />
            <span>New audio</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Video className="mr-2 h-4 w-4" />
            <div>New video</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            push(`/~/create-space`)
          }}
        >
          <Users2 className="mr-2 h-4 w-4" />
          <span>New space</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
