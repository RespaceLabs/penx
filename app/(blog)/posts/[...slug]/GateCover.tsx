'use client'

import { Button } from '@/components/ui/button'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'

interface Props {
  slug: string
}

export function GateCover({ slug }: Props) {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { data } = useSession()
  return (
    <div className="h-80 absolute bottom-0 w-full bg-gradient-to-t from-white from-50% via-white/80 via-90% to-95% to-white/0 flex flex-col justify-center gap-6 -mt-16 dark:from-transparent dark:bg-transparent">
      <div className="text-center font-semibold text-2xl">
        The creator made this a member only post.
      </div>
      <div className="flex justify-center gap-3 items-center">
        <Button
          size="lg"
          className="w-48 rounded-xl"
          onClick={() => {
            if (!isConnected) {
              openConnectModal?.()
            }
            if (data) {
              location.href = `/creator-fi/plans?post_slug=${slug}`
            }
          }}
        >
          Become a member
        </Button>
      </div>
    </div>
  )
}
