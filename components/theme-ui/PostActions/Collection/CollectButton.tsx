'use client'

import { useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import useSession from '@/lib/useSession'
import { cn } from '@/lib/utils'
import { Post } from '@/lib/theme.types'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { CollectDialog } from './CollectDialog'

interface State {
  isLoading: boolean
  isOpen: boolean
}

interface Props {
  post: Post
  className?: string
}

export function CollectButton({ post, className }: Props) {
  const site = useSiteContext()
  const { data, status } = useSession()
  const { address = '' } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [state, setState] = useState<State>({
    isLoading: false,
    isOpen: false,
  })

  const authenticated = !!data

  return (
    <>
      <CollectDialog
        post={post}
        isLoading={state.isLoading}
        isOpen={state.isOpen}
        setState={setState}
      />
      {authenticated ? (
        <Button
          size="sm"
          variant="brand"
          className={cn('rounded-xl text-sm', className)}
          onClick={() => {
            if (!address) {
              return openConnectModal?.()
            }
            setState((prev) => ({ ...prev, isOpen: true }))
          }}
        >
          Collect
        </Button>
      ) : (
        <WalletConnectButton
          size="sm"
          variant="brand"
          className={cn('rounded-xl text-sm', className)}
        >
          Collect
        </WalletConnectButton>
      )}
    </>
  )
}
