'use client'

import { PropsWithChildren, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface Props {
  pathname: string
}

export function NavName({ pathname, children }: PropsWithChildren<Props>) {
  const currentPathname = usePathname()
  const [active, setActive] = useState(pathname === currentPathname)

  useEffect(() => {
    setActive(pathname === currentPathname)
  }, [currentPathname])

  return <div className={cn('', active && 'text-black')}>{children}</div>
}
