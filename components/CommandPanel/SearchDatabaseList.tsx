import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { bgColorMaps } from '@/lib/color-helper'
import { usePaletteDrawer } from '@/lib/hooks'
import { useDatabases } from '@/lib/hooks/useDatabases'
import { cn } from '@/lib/utils'
import { LoadingDots } from '../icons/loading-dots'
import { CommandGroup, CommandItem } from './command-components'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'

interface Props {
  heading?: string
  isRecent?: boolean
}

export function SearchDatabaseList({ heading = '', isRecent }: Props) {
  const { close } = useOpen()
  const { data = [], isLoading } = useDatabases()
  const databases = isRecent ? data.slice(0, 3) : data

  const { search, setSearch } = useSearch()
  const q = search.replace(/^#(\s+)?/, '') || ''
  const regex = /^(\S+)\s?(.*)?$/
  const [_, tag, text] = q.match(regex) || []
  const paletteDrawer = usePaletteDrawer()
  const { push } = useRouter()

  const filteredItems = useMemo(() => {
    if (!q) return databases
    const items = databases.filter(({ name = '' }) => {
      return name?.toLowerCase().includes(tag.toLowerCase())
    })
    const canSearchALlNodesByTag = /^#(\S)+\s$/.test(q)

    if (!text && !canSearchALlNodesByTag) return items
    return items
  }, [databases, q, tag, text, q])

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!filteredItems.length && isRecent) {
    return null
  }

  if (!filteredItems.length) {
    return (
      <div className="text-sm flex items-center justify-center h-16">
        No results found.
      </div>
    )
  }

  return (
    <CommandGroup heading={heading}>
      {filteredItems.map((item) => {
        return (
          <CommandItem
            key={item.id}
            value={item.id}
            className=""
            onSelect={() => {
              paletteDrawer?.close()
              close()
              setSearch('')
              push(`/~/database?id=${item.id}`)
            }}
          >
            <span
              className={cn(
                'h-5 w-5 rounded-full flex items-center justify-center text-background text-sm',
                bgColorMaps[item.color!] || 'bg-foreground/50',
              )}
            >
              #
            </span>

            {item.name || 'Untitled'}
          </CommandItem>
        )
      })}
    </CommandGroup>
  )
}
