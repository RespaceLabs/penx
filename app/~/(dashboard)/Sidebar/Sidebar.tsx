import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
import { ProfilePopover } from '@/components/Profile/ProfilePopover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { store } from '@/store'
import { Calendar, Feather, FileText, Hash, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Merienda } from 'next/font/google'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FavoriteBox } from './FavoriteBox/FavoriteBox'
import { SidebarItem } from './SidebarItem'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export const Sidebar = () => {
  const { data: session } = useSession()
  // const pathname = usePathname()
  const { push } = useRouter()

  return (
    <div className="flex-col flex-1 hidden md:flex bg-sidebar/70 gap-3 h-screen border-r border-r-sidebar">
      <div className="px-4 py-3">
        <ProfilePopover
          showAddress
          className="px-2 py-2 -mx-2 rounded-lg hover:bg-foreground/5 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1 flex-1 px-2">
        <Link href="/~/journals">
          <SidebarItem
            icon={<Calendar size={20} />}
            label="Journals"
            onClick={async () => {
              const node = await store.node.selectDailyNote()
              push(`/~/notes/${node.id}`)
            }}
          />
        </Link>

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

        <Link href="/~/notes">
          <SidebarItem icon={<FileText size={18} />} label="Notes" />
        </Link>

        <Link href="/~/posts">
          <SidebarItem icon={<Feather size={20} />} label="Posts" />
        </Link>

        <Link href="/~/settings">
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
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
