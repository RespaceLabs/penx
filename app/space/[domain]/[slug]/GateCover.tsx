'use client'

import { WalletConnectButton } from '@/components/WalletConnectButton'

interface Props {}

export function GateCover({}: Props) {
  return (
    <div className="h-80 absolute bottom-0 w-full bg-gradient-to-t from-white from-50% via-white/80 via-90% to-95% to-white/0 flex flex-col justify-center gap-6">
      <div className="text-center font-semibold text-2xl">
        The creator made this a (Key holder only) post.
      </div>
      <div className="flex justify-center gap-3 items-center">
        <WalletConnectButton size="lg" className="w-48 rounded-lg">
          Buy Post{"'"}s Key
        </WalletConnectButton>
        <div className="text-sm font-medium">Or</div>
        <WalletConnectButton
          size="lg"
          variant="outline"
          className="w-48 rounded-lg"
        >
          Become Space Member
        </WalletConnectButton>
      </div>
    </div>
  )
}
