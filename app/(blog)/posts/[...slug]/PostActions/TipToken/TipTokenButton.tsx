'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Post } from '@plantreexyz/types'
import { AuthType } from '@prisma/client'
import { useAppKit } from '@reown/appkit/react'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { TipTokenDialog } from './TipTokenDialog'
import { useTipTokenDialog } from './useTipTokenDialog'

interface Props {
  post: Post
}

export function TipTokenButton({ post }: Props) {
  const { setIsOpen } = useTipTokenDialog()
  const site = useSiteContext()
  const { data, status } = useSession()
  const { address = '' } = useAccount()
  const { open } = useAppKit()
  if (site.authType === AuthType.GOOGLE) return null

  const authenticated = !!data

  return (
    <>
      <TipTokenDialog post={post} />
      {authenticated ? (
        <Button
          size="sm"
          variant="outline"
          className="rounded-xl text-sm"
          onClick={() => {
            if (!address) return open()
            setIsOpen(true)
          }}
        >
          Tip $TREE
        </Button>
      ) : (
        <WalletConnectButton
          size="sm"
          variant="outline"
          className="rounded-xl text-sm"
          authType={site.authType}
        >
          Tip $TREE
        </WalletConnectButton>
      )}
    </>
  )
}
