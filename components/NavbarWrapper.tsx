import React, { HTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

interface Props extends HTMLAttributes<any> {}
export function NavbarWrapper({
  children,
  ...rest
}: PropsWithChildren & Props) {
  return (
    <div className={cn('h-12 flex items-center px-4 gap-2', rest.className)}>
      {children}
    </div>
  )
}
