'use client'

import { Button } from '@/components/ui/button'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

export function LaunchButton() {
  const { open } = useWeb3Modal()
  const { isConnected } = useAccount()
  const { push } = useRouter()
  return (
    <Button
      className="font-semibold rounded-full h-12 px-10 text-base"
      onClick={() => {
        if (!isConnected) return open()
        push('/~')
      }}
    >
      Start to write
    </Button>
  )
}
