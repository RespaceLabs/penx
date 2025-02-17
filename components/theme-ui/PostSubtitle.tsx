import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

export function PostSubtitle({ children, className }: Props) {
  return (
    <p className={cn('text-lg text-foreground/50', className)}>{children}</p>
  )
}
