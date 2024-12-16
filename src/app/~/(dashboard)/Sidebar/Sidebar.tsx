import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { useSiteContext } from '@/components/SiteContext'
import { Badge } from '@/components/ui/badge'
import { SiteMode } from '@prisma/client'
import { Calendar, Feather, Link2Icon, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { EnableWeb3Entry } from './EnableWeb3Entry'
import { LinkGoogleEntry } from './LinkGoogleEntry'
import { LinkWalletEntry } from './LinkWalletEntry'
import { NodesBox } from './NodesBox'
import { SidebarItem } from './SidebarItem'
import { SyncBar } from './SyncBar/SyncBar'

export const Sidebar = () => {
  const pathname = usePathname()
  const site = useSiteContext()
  const { data: session } = useSession()
  const { spaceId } = site
  const isBasicMode = (site as any)?.mode === SiteMode.BASIC

  return (
    <div className="flex-col flex-1 flex gap-3 h-screen border-r border-r-sidebar">
      <div className="px-4 flex items-center h-16">
        <ProfilePopover
          showAddress
          showDropIcon
          className="px-2 py-2 flex-1 -mx-2 rounded-lg hover:bg-foreground/5 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1 px-2">
        {!isBasicMode && (
          <Link href="/~/objects/today">
            <SidebarItem
              isActive={pathname === '/~/objects/today'}
              icon={<Calendar size={18} />}
              label="Today"
            />
          </Link>
        )}

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

        <Link href="/~/settings">
          <SidebarItem
            isActive={pathname === '/~/settings'}
            icon={<Settings size={18} />}
            label="Settings"
          />
        </Link>
        <EnableWeb3Entry />
        <LinkGoogleEntry />
        <LinkWalletEntry />
      </div>

      <div className="flex-1 z-10 overflow-auto px-2">
        {/* <FavoriteBox nodeList={nodeList} /> */}
        {!isBasicMode && <NodesBox />}
      </div>
      {!isBasicMode && <SyncBar />}
    </div>
  )
}
