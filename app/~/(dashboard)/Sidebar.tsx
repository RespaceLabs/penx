import { useMemo } from 'react'
import { Bullet } from '@/components/Bullet'
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
  Hash,
  Settings,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Merienda } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { FavoriteBox } from '../../../components/EditorApp/Sidebar/FavoriteBox/FavoriteBox'
import { SidebarItem } from '../../../components/EditorApp/Sidebar/SidebarItem'

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
    <div className="flex-col flex-1 hidden md:flex bg-sidebar gap-3 h-screen overflow-auto">
      <div className={cn('font-bold text-xl px-3 py-2', merienda.className)}>
        {site.name}
      </div>
      <div className="px-2">
        <div className="flex flex-col gap-1 flex-1 mt-3">
          <SidebarItem
            icon={<Calendar size={20} />}
            label="Today"
            isActive={isTodayActive}
            onClick={async () => {
              const node = await store.node.selectDailyNote()
              push('/~/node')
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
            icon={
              <Bullet mr-4 innerColor={isRootActive ? 'brand500' : undefined} />
            }
            label="Pages"
            isActive={isRootActive}
            onClick={async () => {
              const node = await store.node.selectSpaceNode(session?.userId!)
              push('/~/node')
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
          Create page
        </Button>
      </div>
    </div>
  )
}
