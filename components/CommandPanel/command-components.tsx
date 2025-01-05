import { Command } from 'cmdk'
import { cn } from '@/lib/utils'
import { withCn, withRef } from '@udecode/cn'

export const CommandItem = withCn(
  Command.Item,
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
)

export const CommandInput = withRef<typeof Command.Input>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <Command.Input
        ref={ref}
        className={cn(
          'flex h-9 w-full rounded-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
)

export const CommandGroup = withCn(
  Command.Group,
  'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
)
