import { PropsWithChildren, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { BookOpenText, Settings, UserRound } from 'lucide-react'
import { Merienda } from 'next/font/google'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const SidebarItem = ({
  children,
  icon,
}: PropsWithChildren<{ icon: ReactNode }>) => (
  <div className="flex gap-2  hover:bg-zinc-200 cursor-pointer px-2 py-2 rounded-md font-medium -mx-2">
    <div className="text-neutral-600">{icon}</div>
    <div className="text-neutral-600">{children}</div>
  </div>
)

export function Sidebar() {
  return (
    <div className="w-[250px] bg-accent px-3 py-3 space-y-5 flex flex-col">
      <div className={cn('font-bold text-3xl', merienda.className)}>Leen</div>
      <div className="flex flex-col gap-y-[1px] flex-1">
        <SidebarItem icon={<BookOpenText size={20}></BookOpenText>}>
          <div>Posts</div>
        </SidebarItem>
        <SidebarItem icon={<UserRound size={20}></UserRound>}>
          <div></div>
          <div>Authors</div>
        </SidebarItem>
        <SidebarItem icon={<Settings size={20}></Settings>}>
          <div>Settings</div>
        </SidebarItem>
      </div>
      <div>
        <a
          href={`https://www.respace.one/space/xx`}
          className="flex items-center gap-1 bg-zinc-200 justify-center py-2 px-3 rounded-xl text-zinc-600"
          target="_blank"
        >
          <span>See in</span>
          <span className="text-pink-500">respace.one</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  )
}
