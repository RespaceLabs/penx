import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { BlockquoteElement } from './types'

export const Blockquote = ({
  attributes,
  children,
  nodeProps,
}: ElementProps<BlockquoteElement>) => {
  return (
    <blockquote
      {...attributes}
      {...nodeProps}
      className={cn(
        'border-l border-3 border-foreground/20 text-base leading-snug m0 pl-2 py-0 h-1.5 relative',
        nodeProps?.className,
      )}
    >
      {children}
    </blockquote>
  )
}
