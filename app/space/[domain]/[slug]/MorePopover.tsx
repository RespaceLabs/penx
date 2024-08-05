'use client'

import { useSellDialog } from '@/components/SellDialog/useSellDialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAddress } from '@/hooks/useAddress'
import { PostWithSpace } from '@/hooks/usePost'
import { GateType } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { Space } from '@prisma/client'
import { Ellipsis, Key, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  className?: string
  space: Space
}

export function MorePopover({ className = '', space }: Props) {
  const { push } = useRouter()
  const { setIsOpen } = useSellDialog()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2 rounded-xl h-9 w-9 p-0"
        >
          <Ellipsis size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer py-2"
            onClick={() => {
              setIsOpen(true)
            }}
          >
            <Key className="mr-2 h-4 w-4" />
            <span>Sell post Key</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer py-2"
            onClick={() => {
              push(`/@${space.subdomain}`)
            }}
          >
            <Target className="mr-2 h-4 w-4" />
            <span>To this space</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
