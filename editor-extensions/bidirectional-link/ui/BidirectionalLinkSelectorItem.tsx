import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Node } from '@/lib/model'
import { cn } from '@/lib/utils'

import { useStore } from 'stook'

interface BidirectionalLinkSelectorItemProps {
  id: string
  isActive: boolean
  node: Node
  onClick: () => void
}

export function BidirectionalLinkSelectorItem({
  id,
  isActive,
  node,
  onClick,
}: BidirectionalLinkSelectorItemProps) {
  const [value, setValue] = useStore(id, false)
  const root = document.getElementById('internal-link-selector')
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    root: root ? root : null,
  })

  useEffect(() => {
    if (value !== inView) setValue(inView)
  }, [inView, value, setValue])

  return (
    <div
      ref={ref}
      id={id}
      onClick={onClick}
      className={cn(
        'hover:bg-foreground/5 py-2 px-3 cursor-pointer gap-x-2 flex items-center leading-none',
        isActive && 'bg-foreground/5',
      )}
    >
      <div>{node.title || 'Untitled'}</div>
    </div>
  )
}
