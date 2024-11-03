'use client'

import { useSiteContext } from '@/components/SiteContext'
import { Button } from '@/components/ui/button'
import { WalletConnectButton } from '@/components/WalletConnectButton'
import { cn } from '@/lib/utils'
import { Post } from '@plantreexyz/types'
import { AuthType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useAccount } from 'wagmi'
import { CollectDialog } from './CollectDialog'
import { useTipTokenDialog } from './useTipTokenDialog'

interface Props {
  post: Post
  className?: string
}

export function CollectButton({ post, className }: Props) {
  const { setIsOpen } = useTipTokenDialog()
  const site = useSiteContext()
  const { data, status } = useSession()
  const { address = '' } = useAccount()
  // useWatchTipEvent()
  if (site.authType === AuthType.GOOGLE) return null

  const authenticated = !!data && address

  return (
    <>
      <CollectDialog post={post} />
      {authenticated ? (
        <Button
          size="sm"
          variant="brand"
          className={cn('rounded-xl text-sm', className)}
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Collect
        </Button>
      ) : (
        <WalletConnectButton
          size="sm"
          variant="brand"
          className={cn('rounded-xl text-sm', className)}
          authType={site.authType}
        >
          Collect
        </WalletConnectButton>
      )}
    </>
  )
}
