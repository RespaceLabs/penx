import { Dispatch, SetStateAction, useMemo } from 'react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePaletteDrawer } from '@/lib/hooks'
import { usePages } from '@/lib/hooks/usePages'
import { LoadingDots } from '../icons/loading-dots'
import { CommandGroup, CommandItem } from './command-components'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'

interface Props {
  heading?: string
  isRecent?: boolean
}

export function SearchPageList({ heading = '', isRecent = false }: Props) {
  const { close } = useOpen()
  const { data = [], isLoading } = usePages()
  const { search, setSearch } = useSearch()
  const q = search.replace(/^@(\s+)?/, '') || ''
  const paletteDrawer = usePaletteDrawer()
  const { push } = useRouter()

  const filteredItems = useMemo(() => {
    if (!q) return data
    const items = data.filter(({ title = '' }) => {
      return title?.toLowerCase().includes(q.toLowerCase())
    })

    return items
  }, [data, q])

  if (isLoading) {
    return (
      <div>
        <LoadingDots className="bg-foreground/60" />
      </div>
    )
  }

  if (!filteredItems.length) {
    return (
      <div className="text-sm flex items-center justify-center h-16">
        No results found.
      </div>
    )
  }

  return (
    <>
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
                push(`/~/page?id=${item.id}`)
              }}
            >
              <File size={16} />
              {item.title || 'Untitled'}
            </CommandItem>
          )
        })}
      </CommandGroup>
    </>
  )
}
