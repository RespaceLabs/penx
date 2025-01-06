'use client'

import { Search } from 'lucide-react'
import { useOpen } from '@/components/CommandPanel/hooks/useOpen'
import { Kbd } from '@/components/Kbd'

interface Props {}

export const QuickSearchTrigger = ({}: Props) => {
  const { setOpen } = useOpen()
  return (
    <div className="p-4">
      <div
        className="flex items-center justify-between border border-foreground/10 rounded-lg py-2 px-2 cursor-pointer hover:bg-foreground/5 transition-colors"
        onClick={() => {
          setOpen(true)
        }}
      >
        <div className="flex items-center gap-1">
          <Search size={20} className="text-foreground/40" />
          <span className="text-foreground/40 text-sm">Quick search</span>
        </div>
        <div className="flex items-center gap-1">
          <Kbd className="bg-foreground/10">⌘</Kbd>
          <Kbd className="bg-foreground/10">k</Kbd>
        </div>
      </div>
    </div>
  )
}
