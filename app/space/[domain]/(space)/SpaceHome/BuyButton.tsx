'use client'

import { useBuyDialog } from '@/components/BuyDialog/useBuyDialog'
import { Button } from '@/components/ui/button'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Key } from 'lucide-react'
import { useAccount } from 'wagmi'

interface Props {}

export function BuyButton({}: Props) {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()
  const { setIsOpen } = useBuyDialog()

  return (
    <Button
      className="flex items-center gap-2 flex-1"
      onClick={() => {
        if (!isConnected) return open()
        setIsOpen(true)
      }}
    >
      <Key size={16}></Key>
      <div>Buy key</div>
    </Button>
  )
}
