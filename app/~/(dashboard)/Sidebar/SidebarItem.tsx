import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  label: ReactNode
  icon: ReactNode
  isActive?: boolean
  children?: ReactNode
  onClick: () => void
}

export const SidebarItem = ({
  icon,
  label,
  isActive,
  onClick,
  children,
  ...rest
}: SidebarItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded px-2 text-foreground hover:bg-foreground/5 h-8 transition-all cursor-pointer',
        isActive && 'text-brand-500',
      )}
      {...rest}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="">{icon}</div>
        <div>{label}</div>
      </div>
      {children}
    </div>
  )
}
