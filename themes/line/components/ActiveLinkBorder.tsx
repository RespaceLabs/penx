'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface Props {
  pathname: string
}

export function ActiveLinkBorder({ pathname }: Props) {
  const currentPathname = usePathname()
  const [active, setActive] = useState(pathname === currentPathname)

  useEffect(() => {
    setActive(pathname === currentPathname)
  }, [currentPathname])

  return (
    <div className={cn('w-full h-[2px] -mb-[1px]', active && 'bg-black')}></div>
  )
}
