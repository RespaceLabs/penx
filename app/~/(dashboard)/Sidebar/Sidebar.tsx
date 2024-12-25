import {
  Calendar,
  Feather,
  ImageIcon,
  Link2Icon,
  Settings,
  TableProperties,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { useSiteContext } from '@/components/SiteContext'
import { cn } from '@/lib/utils'
import { EnableWeb3Entry } from './EnableWeb3Entry'
import { LinkGoogleEntry } from './LinkGoogleEntry'
import { LinkWalletEntry } from './LinkWalletEntry'
import { SidebarItem } from './SidebarItem'

interface SidebarProps {
  bordered?: boolean
}

export const Sidebar = ({ bordered = true }: SidebarProps) => {
  const pathname = usePathname()
  const site = useSiteContext()
  const { spaceId } = site

  return (
    <div
      className={cn(
        'flex-col flex-1 flex gap-3 h-screen border-r-sidebar',
        bordered && 'border-r',
      )}
    >
      <div className="px-4 flex items-center h-16">
        <ProfilePopover
          showName
          showDropIcon
          className="px-2 py-2 flex-1 -mx-2 rounded-lg hover:bg-foreground/5 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1 px-2">
        {/* <SidebarItem
              icon={
                <CircleCheck
                  size={18}
                  stroke={isTodosActive ? 'brand500' : 'gray500'}
                />
              }
              label="Tasks"
              isActive={isTodosActive}
              onClick={() => {
                store.router.routeTo('TODOS')
              }}
            /> */}

        {/* <SidebarItem
            icon={
              <div gray500 inlineFlex brand500={isTagsActive}>
                <Hash size={18} strokeWidth={1.5} />
              </div>
            }
            label="Tags"
            isActive={isTagsActive}
            onClick={() => {
              store.node.selectTagBox()
            }}
          /> */}

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
