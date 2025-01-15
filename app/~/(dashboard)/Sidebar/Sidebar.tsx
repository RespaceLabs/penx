import { useMemo } from 'react'
import {
  Calendar,
  CalendarDays,
  Feather,
  FileText,
  ImageIcon,
  Link2Icon,
  Settings,
  TableProperties,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { useSiteContext } from '@/components/SiteContext'
import { cn, isValidUUIDv4 } from '@/lib/utils'
import { EnableWeb3Entry } from './EnableWeb3Entry'
import { LinkGoogleEntry } from './LinkGoogleEntry'
import { LinkWalletEntry } from './LinkWalletEntry'
import { QuickSearchTrigger } from './QuickSearchTrigger'
import { SidebarItem } from './SidebarItem'

interface SidebarProps {
  bordered?: boolean
}

export const Sidebar = ({ bordered = true }: SidebarProps) => {
  const pathname = usePathname()
  const site = useSiteContext()
  const { spaceId } = site
  const params = useSearchParams()
  const id = params?.get('id') || ''

  const isJournalActive = useMemo(() => {
    if (!pathname.startsWith('/~/page')) return false
    if (!id) return false
    return !isValidUUIDv4(id)
  }, [pathname, id])

  return (
    <div
      className={cn(
        'flex-col flex-1 flex gap-3 h-screen border-r-sidebar',
        bordered && 'border-r',
      )}
    >
      <div className="px-4 flex items-center h-12 mt-2">
        <ProfilePopover
          showName
          showDropIcon
          className="px-2 py-2 flex-1 -mx-2 rounded-lg hover:bg-foreground/5 transition-colors"
        />
      </div>

      <QuickSearchTrigger />

      <div className="flex flex-col gap-1 px-2">
        <Link href="/~/page?id=today">
          <SidebarItem
            isActive={isJournalActive}
            icon={<CalendarDays size={18} />}
            label="Today"
          ></SidebarItem>
        </Link>

        <Link href="/~/posts">
          <SidebarItem
            isActive={pathname.startsWith('/~/posts')}
            icon={<Feather size={18} />}
            label="Posts"
          ></SidebarItem>
        </Link>

        <Link href="/~/assets">
          <SidebarItem
            isActive={pathname.startsWith('/~/assets')}
            icon={<ImageIcon size={18} />}
            label="Gallery"
          ></SidebarItem>
        </Link>

        <Link href="/~/pages">
          <SidebarItem
            isActive={pathname.startsWith('/~/pages')}
            icon={<FileText size={18} />}
            label="pages"
          ></SidebarItem>
        </Link>

        <Link href="/~/databases">
          <SidebarItem
            isActive={pathname.startsWith('/~/databases')}
            icon={<TableProperties size={18} />}
            label="Databases"
          ></SidebarItem>
        </Link>

        <Link href="/~/settings">
          <SidebarItem
            isActive={pathname === '/~/settings'}
            icon={<Settings size={18} />}
            label="Settings"
          />
        </Link>
        {!spaceId && <EnableWeb3Entry />}
        <LinkGoogleEntry />
        <LinkWalletEntry />
      </div>
    </div>
  )
}
