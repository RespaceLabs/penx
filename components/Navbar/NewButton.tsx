'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAddress } from '@/hooks/useAddress'
import { useCreatePost } from '@/hooks/useCreatePost'
import { Cat, Feather, Headphones, Plus, Users2, Video } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Props {}

export function NewButton({}: Props) {
  const { push } = useRouter()
  const createPost = useCreatePost()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="rounded-xl">
          <Plus size={20}></Plus>
          <div>Create</div>
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
