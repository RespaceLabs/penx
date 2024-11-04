import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Node } from '@/lib/model'
import { cn } from '@/lib/utils'
import { useStore } from 'stook'

interface TagSelectorItemProps {
  id: string
  isActive: boolean
  name: string
  node: Node
  onClick: () => void
}

export function TagSelectorItem({
  id,
  isActive,
  name,
  node,
  onClick,
}: TagSelectorItemProps) {
  const [value, setValue] = useStore(id, false)
  const root = document.getElementById('editor-block-selector')
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
        'py-2 px-3 rounded-lg cursor-pointer gap-x-2 flex items-center leading-none hover:bg-foreground/5',
        isActive && 'bg-foreground/5',
        node.tagColor,
      )}
    >
      <div>#</div>
      <div className="text-base">{name}</div>
    </div>
  )
}
