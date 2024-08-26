'use client'

import { Badge } from '@/components/ui/badge'
import { useSpace } from '@/hooks/useSpace'

export function SpaceAddress() {
  const { space } = useSpace()
  const { spaceAddress = '' } = space
  return (
    <Badge variant="secondary" size="sm" className="text-sm rounded-md">
      {spaceAddress?.slice(0, 4) + '...' + spaceAddress?.slice(-4)}
    </Badge>
  )
}
