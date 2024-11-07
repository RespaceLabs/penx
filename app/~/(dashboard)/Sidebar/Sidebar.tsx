import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { store } from '@/store'
import { Calendar, Feather, FileText, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SidebarItem } from './SidebarItem'

export const Sidebar = () => {
  const { push } = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex-col flex-1 hidden md:flex gap-3 h-screen border-r border-r-sidebar">
      <div className="px-4 flex items-center h-16">
        <ProfilePopover
          showAddress
          className="px-2 py-2 flex-1 -mx-2 rounded-lg hover:bg-foreground/5 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1 flex-1 px-2">
        <Link href="/~/journals">
          <SidebarItem
            isActive={pathname === '/~/journals'}
            icon={<Calendar size={18} />}
            label="Journals"
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

        <Link href="/~/notes">
          <SidebarItem
            isActive={pathname === '/~/notes'}
            icon={<FileText size={18} />}
            label="Notes"
          >
            <Badge
              className="text-xs font-semibold h-6 bg-amber-500/20 text-amber-500"
              variant="secondary"
            >
              Draft
            </Badge>
          </SidebarItem>
        </Link>

        <Link href="/~/posts">
          <SidebarItem
            isActive={pathname === '/~/posts'}
            icon={<Feather size={18} />}
            label="Posts"
          >
            <Badge
              className="text-xs font-semibold h-6 bg-green-500/20 text-green-500"
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
      </div>

      <div className="p-2">
        <Button
          className="w-full"
          onClick={async () => {
            const node = await store.node.createPageNode()
            push(`/~/notes/${node.id}`)
          }}
        >
          Create note
        </Button>
      </div>
    </div>
  )
}
