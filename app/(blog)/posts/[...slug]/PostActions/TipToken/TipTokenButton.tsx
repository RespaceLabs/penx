'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { Post } from '@penxio/types'
import { AuthType } from '@prisma/client'
import { useConnectModal } from '@rainbow-me/rainbowkit'
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
  const { openConnectModal } = useConnectModal()
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
            if (!address) {
              return openConnectModal?.()
            }

            setIsOpen(true)
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
