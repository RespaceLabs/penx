import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MenuItemProps {
  label: ReactNode
  icon: ReactNode
  className?: string
  children?: ReactNode
  onClick: () => void
}

export const MenuItem = ({
  icon,
  label,
  className,
  onClick,
  children,
  ...rest
}: MenuItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 text-foreground px-3 h-10 border-b hover:bg-foreground/20 transition-all cursor-pointer',
        className,
      )}
      {...rest}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <div className="inline-flex">{icon}</div>
        <div>{label}</div>
      </div>
      {children}
    </div>
  )
}
