'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { useMyAccounts } from '@/hooks/useMyAccounts'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { toast } from 'sonner'
import { useAccount, useSignMessage } from 'wagmi'

export function LinkWalletButton() {
  const { signMessageAsync } = useSignMessage()
  const { address = '' } = useAccount()
  const { isLoading, refetch } = useMyAccounts()
  const { openConnectModal } = useConnectModal()

  return (
    <div>
      <Button
        size="lg"
        className={cn('rounded-lg gap-2 w-full')}
        disabled={isLoading}
        onClick={async () => {
          if (!address) {
            return openConnectModal?.()
          }
          try {
            const message = 'Link a wallet to PenX'
            const signature = await signMessageAsync({
              message,
            })
            await api.user.linkWallet.mutate({
              message,
              signature,
              address,
            })
            await refetch()
            toast.success('Wallet linked successfully')
          } catch (error) {
            const msg = extractErrorMessage(error)
            toast.error(msg)
          }
        }}
      >
        {isLoading && <LoadingDots className="bg-foreground/50" />}
        {!isLoading && (
          <>
            <span className="i-[token--ethm] w-4 h-4"></span>
            <div className="">Link Wallet</div>
          </>
        )}
      </Button>
    </div>
  )
}
