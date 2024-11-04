import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'
import { useStore } from 'stook'

interface BlockSelectorItemProps {
  id: string
  isActive: boolean
  name: string
  description?: string
  icon: any
  onClick: () => void
}

export function BlockSelectorItem({
  id,
  isActive,
  name,
  description,
  icon: Icon,
  onClick,
}: BlockSelectorItemProps) {
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
        'p-3 cursor-pointer gap-x-2 flex items-center leading-none hover:bg-foreground/5',
        isActive && 'bg-foreground/10',
      )}
    >
      <div className="flex items-center justify-center">
        {Icon && <Icon size={20} />}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-sm text-foreground">{name}</div>
        <div className="text-sm text-foreground/500">{description}</div>
      </div>
    </div>
  )
}
