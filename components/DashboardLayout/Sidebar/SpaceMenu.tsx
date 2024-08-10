'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSpaceId } from '@/hooks/useSpaceId'
import { useSpaces } from '@/hooks/useSpaces'
import { ChevronDown, Plus, Settings } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export function SpaceMenu() {
  const { push } = useRouter()
  const { space } = useSpaces()
  const { setSpaceId } = useSpaceId()

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center justify-between px-2 hover:bg-sidebar/50 cursor-pointer font-semibold h-10 w-[200px] rounded-lg">
            <div className="flex items-center gap-2">
              <Image
                src={space.logo!}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 rounded-full"
              />

              <div>{space.name}</div>
              <ChevronDown size={16} className="text-neutral-600" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          alignOffset={10}
          className="w-[200px]"
        >
          <DropdownMenuItem
            key={space.id}
            className="cursor-pointer flex gap-2 items-center"
            onClick={() => {
              push('/~/settings')
            }}
          >
            <Settings size={20} className="inline-flex" />
            <div className="">Space settings</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
