'use client'

import { useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import useSession from '@/lib/useSession'
import { Post } from '@/lib/theme.types'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { TipTokenDialog } from './TipTokenDialog'

interface State {
  isLoading: boolean
  isOpen: boolean
}

interface Props {
  post: Post
  receivers: string[]
}

export function TipTokenButton({ post, receivers }: Props) {
  const site = useSiteContext()
  const { data, status } = useSession()
  const { address = '' } = useAccount()
  const [state, setState] = useState<State>({
    isLoading: false,
    isOpen: false,
  })

  const { openConnectModal } = useConnectModal()

  const authenticated = !!data

  return (
    <>
      <TipTokenDialog
        post={post}
        isLoading={state.isLoading}
        receivers={receivers}
        isOpen={state.isOpen}
        setState={setState}
      />
      {authenticated ? (
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl text-sm"
          onClick={() => {
            if (!address) {
              return openConnectModal?.()
            }
            setState((prev) => ({ ...prev, isOpen: true }))
          }}
        >
          Tip $PEN
        </Button>
      ) : (
        <WalletConnectButton
          size="sm"
          variant="outline"
          className="rounded-xl text-sm"
        >
          Tip $PEN
        </WalletConnectButton>
      )}
    </>
  )
}
