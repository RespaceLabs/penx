import { Dispatch, SetStateAction, useState } from 'react'
import { PenLine } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Menu, MenuItem } from '@/components/ui/menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { bgColorMaps } from '@/lib/color-helper'
import { useCopyToClipboard } from '@/lib/hooks/useCopyToClipboard'
import { cn } from '@/lib/utils'
import { PopoverClose } from '@radix-ui/react-popover'
import { useDatabaseContext } from './DatabaseProvider'

function ColorSelector({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { updateDatabase } = useDatabaseContext()
  const colorNames: string[] = Object.values(bgColorMaps)

  async function selectColor(color: string) {
    updateDatabase({ color })
    setOpen(false)
  }

  return (
    <div className="flex items-center flex-wrap gap-2 p-4">
      {colorNames.map((color) => (
        <div
          key={color}
          className={cn(
            'h-6 w-6 rounded-full cursor-pointer hover:scale-110 transition-colors',
            color,
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
          <div className="text-base font-bold">
            {database.name || 'Untitled'}
          </div>
          <PenLine size={12} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64">
        <Content setOpen={setOpen}></Content>
      </PopoverContent>
    </Popover>
  )
}
