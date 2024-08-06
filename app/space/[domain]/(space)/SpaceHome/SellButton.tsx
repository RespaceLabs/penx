'use client'

import { useSellDialog } from '@/components/SellDialog/useSellDialog'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { cn } from '@/lib/utils'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Key } from 'lucide-react'
import { useAccount } from 'wagmi'

interface Props {}

export function SellButton({}: Props) {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()
  const { setIsOpen } = useSellDialog()

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 flex-1"
      onClick={() => {
        if (!isConnected) return open()
        setIsOpen(true)
      }}
    >
      <Key size={16}></Key>
      <div>Sell key</div>
    </Button>
  )
}
