import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { Badge } from '@/components/ui/badge'
import { Calendar, Feather, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { NodesBox } from './NodesBox'
import { SidebarItem } from './SidebarItem'
import { SyncBar } from './SyncBar/SyncBar'

export const Sidebar = () => {
  const pathname = usePathname()

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
        <Link href="/~/objects/today">
          <SidebarItem
            isActive={pathname === '/~/objects/today'}
            icon={<Calendar size={18} />}
            label="Today"
          />
        </Link>

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
            isActive={pathname === '/~/posts'}
            icon={<Feather size={18} />}
            label="Posts"
          >
            <Badge
              className="text-xs font-normal h-6 bg-green-500/20 text-green-500"
              variant="secondary"
            >
              Published
            </Badge>
          </SidebarItem>
        </Link>

        <Link href="/~/settings">
          <SidebarItem
            isActive={pathname === '/~/settings'}
            icon={<Settings size={18} />}
            label="Settings"
          />
        </Link>
      </div>

      <div className="flex-1 z-10 overflow-auto px-2">
        {/* <FavoriteBox nodeList={nodeList} /> */}
        <NodesBox />
      </div>
      <SyncBar />
    </div>
  )
}
