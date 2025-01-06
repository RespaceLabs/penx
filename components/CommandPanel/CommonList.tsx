import { useMemo } from 'react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usePaletteDrawer } from '@/lib/hooks'
import { usePages } from '@/lib/hooks/usePages'
import { CommandGroup, CommandItem } from './command-components'
import { useOpen } from './hooks/useOpen'
import { useSearch } from './hooks/useSearch'
import { SearchDatabaseList } from './SearchDatabaseList'
import { SearchPageList } from './SearchPageList'

interface Props {}

export function CommonList({}: Props) {
  return (
    <>
      <SearchPageList heading="Recent pages" isRecent />
      <SearchDatabaseList heading="Recent databases" isRecent />
    </>
  )
}
