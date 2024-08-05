'use client'

import { useBuyDialog } from '@/components/BuyDialog/useBuyDialog'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { cn } from '@/lib/utils'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Key } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useSponsorBuyDialog } from './SponsorBuyDialog/hooks/useSponsorBuyDialog'

interface Props {}

export function BuyButton({}: Props) {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()
  const { setIsOpen } = useSponsorBuyDialog()

  return (
    <Button
      className="flex items-center gap-2 h-12 rounded-xl"
      onClick={() => {
        if (!isConnected) return open()
        setIsOpen(true)
      }}
    >
      <Key size={16}></Key>
      <div>Become Sponsor</div>
    </Button>
  )
}
