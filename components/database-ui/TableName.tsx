import { Dispatch, SetStateAction, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Menu, MenuItem } from '@/components/ui/menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { bgColorMaps, textColorMaps } from '@/lib/color-helper'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'
import { PopoverClose } from '@radix-ui/react-popover'
import { PenLine } from 'lucide-react'
import { toast } from 'sonner'
import { useDatabaseContext } from './DatabaseProvider'

function ColorSelector({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { updateDatabase, database } = useDatabaseContext()
  const colorEntries = Object.entries(bgColorMaps)

  async function selectColor(color: string) {
    updateDatabase({ color })
    setOpen(false)
  }

  return (
    <div className="flex items-center flex-wrap gap-2 p-4">
      {colorEntries.map(([color, bg]) => (
        <div
          key={color}
          className={cn(
            'h-6 w-6 rounded-full cursor-pointer hover:scale-110 transition-colors',
            bg,
          )}
          title={color}
          onClick={() => selectColor(color)}
        />
      ))}
    </div>
  )
}

function Content({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const { database, updateDatabase } = useDatabaseContext()
  const [name, setName] = useState(database.name || '')
  const { copy } = useCopyToClipboard()

  return (
    <div className="flex flex-col gap-1">
      <div className="px-3 pt-3">
        <Input
          size="sm"
          value={name || ''}
          onBlur={() => {
            updateDatabase({ name })
            setOpen(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateDatabase({ name })
              setOpen(false)
            }
          }}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
      </div>

      <ColorSelector setOpen={setOpen} />

      <Separator />

      <div className="p-1">
        <PopoverClose asChild>
          <MenuItem
            onClick={() => {
              copy(database.id)
              toast.success('Copied to clipboard')
            }}
          >
            Copy database ID
          </MenuItem>
        </PopoverClose>
      </div>
    </div>
  )
}

export const TableName = () => {
  const { database } = useDatabaseContext()
  const [open, setOpen] = useState(false)

  if (!database) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 cursor-pointer">
          <div className="text-base font-bold flex items-center gap-1">
            <span
              className={cn(
                'h-5 w-5 rounded-full flex items-center justify-center text-background text-sm',
                bgColorMaps[database.color!] || 'bg-foreground/50',
              )}
            >
              #
            </span>
            <span>{database.name || 'Untitled'}</span>
          </div>
          <PenLine size={14} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64">
        <Content setOpen={setOpen}></Content>
      </PopoverContent>
    </Popover>
  )
}
