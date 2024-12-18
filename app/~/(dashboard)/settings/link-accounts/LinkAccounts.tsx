'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { LoadingDots } from '@/components/icons/loading-dots'
import { PasswordDialog } from '@/components/PasswordDialog/PasswordDialog'
import { useMyAccounts } from '@/lib/hooks/useMyAccounts'
import { trpc } from '@/lib/trpc'
import { ProviderType } from '@/lib/types'
import { AccountList } from './AccountList'
import { LinkGoogleButton } from './LinkGoogleButton'
import { LinkPasswordButton } from './LinkPasswordButton'
import { LinkWalletButton } from './LinkWalletButton'

export function LinkAccounts() {
  const searchParams = useSearchParams()
  const error = searchParams?.get('error')

  useEffect(() => {
    const errorMessage = Array.isArray(error) ? error.pop() : error
    if (errorMessage === 'account_linked') {
      toast.error('This google is already linked')
    }
  }, [error])

  const { isLoading, data: accounts = [] } = useMyAccounts()

  const hasGoogleAccount = accounts.some(
    (a) => a.providerType === ProviderType.GOOGLE,
  )

  const hasWallet = accounts.some((a) => a.providerType === ProviderType.WALLET)

  const hasPassword = accounts.some(
    (a) => a.providerType === ProviderType.PASSWORD,
  )

  return (
    <div className="">
      <PasswordDialog />
      {isLoading && <LoadingDots className="bg-foreground/60" />}
      {!isLoading && (
        <div className="grid gap-6 w-full md:w-[400px]">
          <AccountList />
          <div className="space-y-2">
            {!hasGoogleAccount && <LinkGoogleButton />}
            {!hasWallet && <LinkWalletButton />}
            {!hasPassword && <LinkPasswordButton />}
          </div>
        </div>
      )}
    </div>
  )
}
