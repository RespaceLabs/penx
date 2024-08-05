'use client'

import { useBuyDialog } from '@/components/BuyDialog/useBuyDialog'
import { Button } from '@/components/ui/button'
import { Space } from '@prisma/client'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Key } from 'lucide-react'
import { useAccount } from 'wagmi'

interface Props {
  space?: Space
}

export function BuyPostButton({ space }: Props) {
  const { setIsOpen } = useBuyDialog()
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()

  return (
    <Button
      // variant="outline"
      size="sm"
      className="my-4 flex items-center gap-2 rounded-xl"
      onClick={() => {
        if (!isConnected) return open()
        setIsOpen(true)
      }}
    >
      <Key size={16}></Key>
      <div>Buy</div>
    </Button>
  )
}
