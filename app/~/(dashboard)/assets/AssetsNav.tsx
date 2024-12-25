'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { UploadAssetButton } from './UploadAssetButton'

enum DisplayMode {
  GALLERY = 'GALLERY',
  LIST = 'LIST',
  TRASH = 'TRASH',
}

export function AssetsNav() {
  const pathname = usePathname()!

  const initialMode = useMemo(() => {
    if (pathname === '/~/assets/list') return DisplayMode.LIST
    return pathname === '/~/assets/trash'
      ? DisplayMode.TRASH
      : DisplayMode.GALLERY
  }, [pathname])

  const [mode, setMode] = useState(initialMode)
  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between px-4 py-3 gap-y-2">
      <div>
        <ToggleGroup
          className="h-10 gap-3 rounded-lg bg-accent p-1"
          value={mode}
          onValueChange={(v) => {
            if (v !== mode) {
              setMode(v as DisplayMode)
            }
          }}
          type="single"
        >
          <ToggleGroupItem
            className="h-full flex-1 bg-accent text-sm font-semibold ring-foreground data-[state=on]:bg-background"
            value={DisplayMode.GALLERY}
            asChild
          >
            <Link href="/~/assets">Gallery</Link>
          </ToggleGroupItem>

          <ToggleGroupItem
            asChild
            value={DisplayMode.LIST}
            className="h-full flex-1 bg-accent text-sm font-semibold ring-foreground data-[state=on]:bg-background"
          >
            <Link href="/~/assets/list">List</Link>
          </ToggleGroupItem>

          <Separator
            className="h-4 bg-background"
            orientation="vertical"
          ></Separator>

          <ToggleGroupItem
            asChild
            value={DisplayMode.TRASH}
            className="h-full flex-1 bg-accent text-sm font-semibold ring-foreground data-[state=on]:bg-background"
          >
            <Link href="/~/assets/trash">Trash</Link>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div>
        <UploadAssetButton />
      </div>
    </div>
  )
}
