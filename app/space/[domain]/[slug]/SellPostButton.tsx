'use client'

import { useBuyDialog } from '@/components/BuyDialog/useBuyDialog'
import { useSellDialog } from '@/components/SellDialog/useSellDialog'
import { Button } from '@/components/ui/button'
import { Space } from '@prisma/client'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Key } from 'lucide-react'
import { useAccount } from 'wagmi'

interface Props {
  space?: Space
}

export function SellPostButton({ space }: Props) {
  const { setIsOpen } = useSellDialog()
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()

  return (
    <Button
      variant="outline"
      size="sm"
      className="my-4 flex items-center gap-2 rounded-xl"
      onClick={() => {
        if (!isConnected) return open()
        setIsOpen(true)
      }}
    >
      <Key size={16}></Key>
      <div>Sell</div>
    </Button>
  )
}
