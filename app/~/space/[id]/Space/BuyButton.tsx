'use client'

import { useBuyDialog } from '@/components/BuyDialog/useBuyDialog'
import { Button } from '@/components/ui/button'
import { Space } from '@prisma/client'
import { Key } from 'lucide-react'

interface Props {
  space?: Space
}

export function BuyButton({ space }: Props) {
  const { setIsOpen } = useBuyDialog()

  return (
    <Button
      className="flex items-center gap-2"
      onClick={() => {
        setIsOpen(true)
      }}
    >
      <Key size={16}></Key>
      <div>Buy</div>
    </Button>
  )
}
