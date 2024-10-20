'use client'

import { Button } from '@/components/ui/button'
import { MintPostDialog } from './MintPostDialog'
import { useMintPostDialog } from './useMintPostDialog'

export function MintPost() {
  const { setIsOpen } = useMintPostDialog()
  return (
    <div className="flex items-center gap-1">
      <MintPostDialog />
      <Button
        size="sm"
        variant="outline"
        className="w-16 rounded-lg"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Mint
      </Button>
    </div>
  )
}
