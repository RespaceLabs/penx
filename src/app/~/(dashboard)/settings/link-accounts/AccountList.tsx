'use client'

import { IconGoogle } from '@/components/icons/IconGoogle'
import LoadingDots from '@/components/icons/loading-dots'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMyAccounts } from '@/hooks/useMyAccounts'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { shortenAddress } from '@/lib/utils'
import { Account, ProviderType } from '@prisma/client'
import { AvatarImage } from '@radix-ui/react-avatar'
import { toast } from 'sonner'

function AccountItem({ account }: { account: Account }) {
  const { refetch } = useMyAccounts()
  const { isPending, mutateAsync } = trpc.user.disconnectAccount.useMutation()
  const info = account.providerInfo as any
  const removeButton = (
    <Button
      disabled={isPending}
      size="xs"
      className="w-20"
      variant="outline"
      onClick={async () => {
        try {
          await mutateAsync({ accountId: account.id })
          await refetch()
          toast.success('Removed successfully')
        } catch (error) {
          const msg = extractErrorMessage(error)
          toast.error(msg || 'Failed to remove account')
        }
      }}
    >
      {isPending && <LoadingDots className="bg-foreground/60" />}
      {!isPending && 'remove'}
    </Button>
  )
  if (account.providerType === ProviderType.GOOGLE) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <IconGoogle className="w-4 h-4" />
            <span>Google</span>
          </Badge>
          <Avatar className="w-6 h-6">
            <AvatarImage src={info?.picture} />
            <AvatarFallback>{info?.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>{info?.email}</div>
        </div>
        {removeButton}
      </div>
    )
  }

  if (account.providerType === ProviderType.WALLET) {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <span className="i-[token--ethm] w-4 h-4"></span>
            <span>Wallet</span>
          </Badge>
          <Avatar className="w-6 h-6">
            <AvatarImage src={info?.picture} />
            <AvatarFallback>{info?.name?.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="">{shortenAddress(account.providerAccountId)}</div>
        </div>
        {removeButton}
      </div>
    )
  }
  return null
}

export function AccountList() {
  const { isLoading, data = [] } = useMyAccounts()

  if (isLoading) return null

  return (
    <div>
      <div className="text-lg font-bold mb-3">Linked account</div>
      <div className="grid gap-4">
        {data.map((account) => {
          return <AccountItem key={account.id} account={account} />
        })}
      </div>
    </div>
  )
}
