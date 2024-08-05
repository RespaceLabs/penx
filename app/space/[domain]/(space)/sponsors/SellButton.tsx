'use client'

import { Button } from '@/components/ui/button'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Key } from 'lucide-react'
import { useAccount } from 'wagmi'
import { useSponsorSellDialog } from './SponsorSellDialog/useSponsorSellDialog'

interface Props {}

export function SellButton({}: Props) {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()
  const { setIsOpen } = useSponsorSellDialog()

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 h-12 rounded-xl"
      onClick={() => {
        if (!isConnected) return open()
        setIsOpen(true)
      }}
    >
      <Key size={16}></Key>
      <div>Stop sponsorship</div>
    </Button>
  )
}
