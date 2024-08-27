'use client'

import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { useSpace } from '@/hooks/useSpace'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api, trpc } from '@/lib/trpc'
import { PopoverClose } from '@radix-ui/react-popover'
import { ChevronDown } from 'lucide-react'

export function SpaceTheme() {
  const { space } = useSpace()
  return (
    <Popover>
      <PopoverTrigger>
        <Badge
          variant="secondary"
          size="sm"
          className="text-sm rounded-md gap-1 cursor-pointer hover:bg-neutral-200"
        >
          <div>theme: {space?.themeName || 'card'}</div>
          <ChevronDown size={16} />
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1">
        <ThemeList />
      </PopoverContent>
    </Popover>
  )
}

function ThemeList() {
  const { data = [], isLoading } = trpc.theme.list.useQuery()
  const { space, setState } = useSpace()

  if (isLoading)
    return (
      <div className="grid gap-2">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <Skeleton key={index} className="h-9" />
          ))}
      </div>
    )

  return (
    <div>
      {data.map((theme) => (
        <PopoverClose
          key={theme.id}
          asChild
          onClick={async () => {
            console.log('g.....')
            await api.space.update.mutate({
              id: space.id,
              themeName: theme.name!,
            })

            revalidateMetadata(`${space.subdomain}-metadata`)
            revalidateMetadata('spaces')

            setState((prevState) => ({
              ...prevState,
              isLoading: false,
              space: {
                ...prevState.space,
                themeName: theme.name!,
              },
            }))
          }}
        >
          <div className="hover:bg-neutral-100 cursor-pointer rounded py-2 px-2">
            {theme.name}
          </div>
        </PopoverClose>
      ))}
    </div>
  )
}
