'use client'

import type { Address } from 'viem'
import { PropsWithChildren } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { spaceAbi } from '@/lib/abi'
import { SPACE_ID } from '@/lib/constants'

export function Gate(props: PropsWithChildren) {
  const { isConnected } = useAccount()
  if (!isConnected) return <MemberGate />
  return <MemberChecker>{props.children}</MemberChecker>
}

export function MemberGate() {
  const { open, close } = useAppKit()
  return (
    <div className="space-y-2 rounded-2xl border p-4 text-center">
      <button
        className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-xl bg-black px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        onClick={() => {
          open()
        }}
      >
        Become member
      </button>
      <div>this post is for members only! Connect wallet to subscribe.</div>
    </div>
  )
}

export function MemberChecker(props: PropsWithChildren) {
  const { address } = useAccount()
  const { data: member, isLoading } = useReadContract({
    abi: spaceAbi,
    address: SPACE_ID,
    functionName: 'getSubscription',
    args: [0, address as Address],
  })

  if (isLoading || !member) return <div>Loading...</div>

  if (member.duration > BigInt(0) && Date.now() / 1000 < member.startTime + member.duration) {
    return <div>{props.children}</div>
  }

  return <MemberGate />
}
