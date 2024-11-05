import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { useFocused, useSelected } from 'slate-react'

export const Divider = ({ attributes, children }: ElementProps) => {
  const selected = useSelected()
  const active = selected

  return (
    <div
      {...attributes}
      className="cursor-pointer flex items-center h-8 w-full"
    >
      <div
        className={cn('flex-1', active ? 'bg-brand-500' : 'bg-foreground/15')}
        style={{ height: active ? 2 : 1 }}
      >
        {children}
      </div>
    </div>
  )
}
