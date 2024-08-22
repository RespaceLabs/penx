'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSpace } from '@/hooks/useSpace'
import { ChevronDown, Plus, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

export function SpaceMenu() {
  const { space } = useSpace()

  const pathname = usePathname()
  const isNotSpace =
    pathname.startsWith('/~/discover') ||
    pathname === '/~' ||
    pathname === '/~/create-space'

  if (!space || isNotSpace) return null
  return (
    <div className="flex items-center justify-between px-2 font-semibold h-10 w-[240px] rounded-lg mt-0.5">
      <div className="flex items-center gap-2">
        <div>{space.name}</div>
        {/* <ChevronDown size={16} className="text-neutral-600" /> */}
      </div>
    </div>
  )

  // return (
  //   <div className="relative">
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <div className="flex items-center justify-between px-2 hover:bg-sidebar/50 cursor-pointer font-semibold h-10 w-[240px] rounded-lg mt-0.5">
  //           <div className="flex items-center gap-2">
  //             <Image
  //               src={
  //                 space.logo! ||
  //                 'https://public.blob.vercel-storage.com/eEZHAoPTOBSYGBE3/JRajRyC-PhBHEinQkupt02jqfKacBVHLWJq7Iy.png'
  //               }
  //               alt=""
  //               width={24}
  //               height={24}
  //               className="w-6 h-6 rounded-full"
  //             />

  //             <div>{space.name}</div>
  //             <ChevronDown size={16} className="text-neutral-600" />
  //           </div>
  //         </div>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent
  //         align="start"
  //         alignOffset={10}
  //         className="w-[200px]"
  //       >
  //         <DropdownMenuItem
  //           key={space.id}
  //           className="cursor-pointer flex gap-2 items-center"
  //           disabled={space.userId !== session?.userId}
  //           onClick={() => {
  //             push(`/~/space/${space.id}/settings`)
  //           }}
  //         >
  //           <Settings size={18} className="inline-flex" />
  //           <div>Space settings</div>
  //         </DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   </div>
  // )
}
