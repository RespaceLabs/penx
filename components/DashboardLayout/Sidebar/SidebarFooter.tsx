'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useSpace } from '@/hooks/useSpace'
import { cn } from '@/lib/utils'
import { TooltipPortal } from '@radix-ui/react-tooltip'
import { Github, Rocket, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SidebarSpaceList } from './SidebarSpaceList'

export function SidebarFooter() {
  const pathname = usePathname()
  const { space } = useSpace()
  const { data: session } = useSession()

  const externalLinks = [
    {
      name: 'Space home',
      href: `/@${space?.subdomain}`,
      icon: <Rocket width={20} />,
    },

    {
      name: 'Star on GitHub',
      href: 'https://github.com/0xzio/penx',
      icon: <Github width={20} />,
    },
  ]

  return (
    <div className="flex flex-col">
      <div className="grid gap-1 items-center justify-center pb-2">
        {session?.userId === space?.userId && (
          <Link
            href="/~/settings"
            className={cn(
              'flex items-center justify-center hover:bg-sidebar h-10 w-10 rounded-full cursor-pointer',
              pathname === '/~/settings' && 'bg-sidebar',
            )}
          >
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center h-full w-full">
                    <Settings width={20} />
                  </div>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent side="right">Space settings</TooltipContent>
                </TooltipPortal>
              </Tooltip>
            </TooltipProvider>
          </Link>
        )}

        {externalLinks.map(({ name, href, icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center hover:bg-sidebar h-10 w-10 rounded-full cursor-pointer"
          >
            <TooltipProvider delayDuration={10}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center h-full w-full">
                    {icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">{name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </a>
        ))}
      </div>
      <SidebarSpaceList />
    </div>
  )
}
