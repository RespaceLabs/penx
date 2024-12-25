import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebarSheet } from './useSidebarSheet'

export const Navbar = () => {
  const { setIsOpen } = useSidebarSheet()

  return (
    <div
      className={cn(
        'flex items-center justify-between md:hidden h-11 border-b border-foreground/5 fixed top-0 w-full px-3 z-50 bg-background',
      )}
    >
      <Menu
        size={20}
        className="cursor-pointer"
        onClick={() => setIsOpen(true)}
      />
    </div>
  )
}
