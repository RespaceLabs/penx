'use client'

import { useEffect } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { useMyAccounts } from '@/hooks/useMyAccounts'
import { trpc } from '@/lib/trpc'
import { ProviderType } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { AccountList } from './AccountList'
import { LinkGoogleButton } from './LinkGoogleButton'
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

  return (
    <div className="">
      {isLoading && <LoadingDots className="bg-foreground/60" />}
      {!isLoading && (
        <div className="grid gap-6 w-full md:w-[400px]">
          <AccountList />
          <div className="space-y-2">
            {!hasGoogleAccount && <LinkGoogleButton />}
            {!hasWallet && <LinkWalletButton />}
          </div>
        </div>
      )}
    </div>
  )
}
