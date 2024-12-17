import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

export function PageTitle({ children, className }: Props) {
  return (
    <h1
      className={cn(
        'text-2xl font-semibold leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-4xl md:leading-13 mt-12 mb-8 text-foreground/90',
        className,
      )}
    >
      {children}
    </h1>
  )
}
