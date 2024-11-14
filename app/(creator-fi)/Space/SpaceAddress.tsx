'use client'

import { Badge } from '@/components/ui/badge'
import { useCopyToClipboard } from '@/app/(creator-fi)/hooks/useCopyToClipboard'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import { useSpaceContext } from '@/components/SpaceContext'

export function SpaceAddress() {
  const space = useSpaceContext()
  const { address = '' } = space
  const { copy } = useCopyToClipboard()
  return (
    <Badge variant="secondary" className="rounded-md text-sm">
      {address?.slice(0, 6) + '...' + address?.slice(-6)}

      <Copy
        size={14}
        className="ml-1 cursor-pointer text-foreground/60 hover:text-foreground/80"
        onClick={() => {
          copy(address!)
          toast.success('Space contract address copied to clipboard')
        }}
      ></Copy>
    </Badge>
  )
}
