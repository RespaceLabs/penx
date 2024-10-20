'use client'

import { Button } from '@/components/ui/button'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

interface Props {}

export function GateCover({}: Props) {
  const { open } = useAppKit()
  const { isConnected } = useAccount()
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
              open()
            }
            location.href = '/creator-fi/plans'
          }}
        >
          Become a member
        </Button>
      </div>
    </div>
  )
}
