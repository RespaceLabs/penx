import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  className?: string
}

export default function SectionContainer({ children, className }: Props) {
  return (
    <section
      className={cn(
        'mx-auto px-4 sm:px-6 xl:px-0 w-full flex flex-col h-screen',
        className,
      )}
    >
      {children}
    </section>
  )
}
