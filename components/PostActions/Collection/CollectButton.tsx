'use client'

import { useState } from 'react'
import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { cn } from '@/lib/utils'
import { Post } from '@penxio/types'
import { AuthType } from '@prisma/client'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSession } from 'next-auth/react'
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
  if (site.authType === AuthType.GOOGLE) return null

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
