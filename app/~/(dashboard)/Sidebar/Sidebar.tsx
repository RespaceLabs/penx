import { useMemo } from 'react'
import { Bullet } from '@/components/Bullet'
import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { useActiveNode } from '@/hooks'
import { Node } from '@/lib/model'
import { useNodes } from '@/lib/node-hooks'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import {
  Boxes,
  BoxIcon,
  Calendar,
  CircleCheck,
  Feather,
  FileText,
  Hash,
  Settings,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Merienda } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { FavoriteBox } from './FavoriteBox/FavoriteBox'
import { SidebarItem } from './SidebarItem'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const Sidebar = () => {
  const { nodes, nodeList } = useNodes()
  const { data: session } = useSession()

  // const name = useRouterName()
  const name = '' as any

  const { activeNode } = useActiveNode()

  const isTodosActive = name === 'TODOS'

  const isTodayActive = useMemo(() => {
    if (name !== 'NODE' || !activeNode) return false
    if (!activeNode) return false
    if (new Node(activeNode).isToday) return true
    return false
  }, [name, activeNode])

  const isTagsActive = useMemo(() => {
    if (name !== 'NODE' || !activeNode) return false
    if (!activeNode) return false
    if (new Node(activeNode).isDatabaseRoot) return true
    return false
  }, [name, activeNode])

  const isRootActive = useMemo(() => {
    if (name !== 'NODE' || !activeNode) return false
    if (!activeNode) return false
    if (new Node(activeNode).isRootNode) return true
    return false
  }, [name, activeNode])

  const site = useSiteContext()
  const { push } = useRouter()

  return (
    <div className="flex-col flex-1 hidden md:flex bg-sidebar/70 gap-3 h-screen overflow-auto border-r border-r-sidebar">
      <div className="px-4 py-3">
        <ProfilePopover
          showAddress
          className="px-2 py-2 -mx-2 rounded-lg hover:bg-foreground/5 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1 flex-1 px-2">
        <SidebarItem
          icon={<Calendar size={20} />}
          label="Today"
          isActive={isTodayActive}
          onClick={async () => {
            const node = await store.node.selectDailyNote()
            push('/~/notes')
          }}
        />

        {/* <SidebarItem
              icon={
                <CircleCheck
                  size={20}
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
                <Hash size={20} strokeWidth={1.5} />
              </div>
            }
            label="Tags"
            isActive={isTagsActive}
            onClick={() => {
              store.node.selectTagBox()
            }}
          /> */}

        <SidebarItem
          icon={<FileText size={18} />}
          label="Notes"
          isActive={isRootActive}
          onClick={async () => {
            const node = await store.node.selectSpaceNode(session?.userId!)
            push('/~/notes')
          }}
        />

        <SidebarItem
          icon={<Feather size={20} />}
          label="Posts"
          isActive={isTodayActive}
          onClick={async () => {
            const node = await store.node.selectDailyNote()
            push('/~/posts')
          }}
        />

        <SidebarItem
          icon={<Settings size={18} />}
          label="Settings"
          onClick={() => {
            push('/~/settings')
          }}
        />
      </div>

      <div className="flex-1 z-10 overflow-auto px-2">
        {!!nodes.length && (
          <>
            <FavoriteBox nodeList={nodeList} />
          </>
        )}
      </div>

      <div className="p-2">
        <Button
          className="w-full"
          onClick={() => {
            store.node.createPageNode()
          }}
        >
          Create note
        </Button>
      </div>
    </div>
  )
}
