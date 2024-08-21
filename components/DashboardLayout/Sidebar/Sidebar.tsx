'use client'

import { useMemo } from 'react'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TooltipPortal } from '@radix-ui/react-tooltip'
import { Compass } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarFooter } from './SidebarFooter'
import { SidebarSpaceNav } from './SidebarSpaceNav'

export function Sidebar() {
  const { data: session } = useSession()

  const pathname = usePathname()
  const isNotSpace =
    pathname.startsWith('/~/discover') ||
    pathname === '/~' ||
    pathname === '/~/create-space'

  const tabs = useMemo(() => {
    const list = [
      {
        name: 'Discover',
        href: '/~/discover',
        isActive: pathname === '/~/discover',
        icon: <Compass width={20} />,
      },
    ]

    return list
  }, [pathname])

  return (
    <div className="sticky top-0 h-screen w-[48px] md:w-[60px] flex-shrink-0 z-1000">
      <div className="flex flex-1 flex-col justify-between min-h-screen">
        <div className="grid gap-1 items-center justify-center pt-1">
          {tabs.map(({ name, href, isActive, icon }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                'flex hover:bg-sidebar h-10 w-10 rounded-full cursor-pointer',
                isActive && 'bg-sidebar',
              )}
            >
              <TooltipProvider delayDuration={10}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-center h-full w-full">
                      {icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipPortal>
                    <TooltipContent side="right" className="">
                      {name}
                    </TooltipContent>
                  </TooltipPortal>
                </Tooltip>
              </TooltipProvider>
            </Link>
          ))}

          <div className="flex justify-center my-2">
            {session && !isNotSpace && (
              <Separator className="-rotate-12 bg-black w-7" />
            )}
          </div>
          {session && !isNotSpace && <SidebarSpaceNav />}
        </div>

        {session && <SidebarFooter />}
      </div>
    </div>
  )
}
