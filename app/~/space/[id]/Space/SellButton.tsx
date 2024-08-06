'use client'

import { useSellDialog } from '@/components/SellDialog/useSellDialog'
import { Button } from '@/components/ui/button'
import { Space } from '@prisma/client'
import { Key } from 'lucide-react'

interface Props {}

export function SellButton({}: Props) {
  const { setIsOpen } = useSellDialog()

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => {
        setIsOpen(true)
      }}
    >
      <Key size={16}></Key>
      <div>Sell</div>
    </Button>
  )
}
