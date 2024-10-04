'use client'

import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { UserAvatar } from './UserAvatar'
import { UserProfile } from './UserProfile'

export function ConnectButton() {
  const { open, close } = useAppKit()
  const { disconnect } = useDisconnect()
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  console.log('======address:', address)

  // if (isConnecting) return <div>Connecting…</div>
  if (isConnected) {
    return <UserProfile />
  }

  return (
    <button
      className="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      onClick={() => {
        open()
      }}
    >
      Become member
    </button>
  )
}
