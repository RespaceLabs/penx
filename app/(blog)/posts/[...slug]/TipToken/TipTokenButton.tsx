'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Post } from '@plantreexyz/types'
import { AuthType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { TipTokenDialog } from './TipTokenDialog'
import { useTipTokenDialog } from './useTipTokenDialog'
import { useWatchTipEvent } from './useWatchTipEvent'

interface Props {
  post: Post
}

export function TipTokenButton({ post }: Props) {
  const { setIsOpen } = useTipTokenDialog()
  const site = useSiteContext()
  const { data, status } = useSession()
  const { address = '' } = useAccount()
  // useWatchTipEvent()
  if (site.authType === AuthType.GOOGLE) return null

  const authenticated = !!data && address

  return (
    <>
      <TipTokenDialog post={post} />
      {authenticated ? (
        <Button
          size="sm"
          variant="secondary"
          className="rounded-xl text-sm"
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Tip $TREE
        </Button>
      ) : (
        <WalletConnectButton
          size="sm"
          variant="secondary"
          className="rounded-xl text-sm"
          authType={site.authType}
        >
          Tip $TREE
        </WalletConnectButton>
      )}
    </>
  )
}
