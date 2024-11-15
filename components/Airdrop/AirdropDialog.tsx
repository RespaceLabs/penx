'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDailyClaimCap } from '@/hooks/useDailyClaimCap'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { dailyClaimAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { useSession } from 'next-auth/react'
import pRetry, { AbortError } from 'p-retry'
import { toast } from 'sonner'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import LoadingDots from '../icons/loading-dots'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { WalletConnectButton } from '../WalletConnectButton'
import { AirdropButton } from './AirdropButton'

interface Props {}

export function AirdropDialog({}: Props) {
  const { data } = useSession()
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <AirdropButton />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] min-h-96 flex flex-col gap-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-center">
              Claim $PEN everyday!
            </DialogTitle>
          </DialogHeader>
          {data && <AuthenticatedContent />}
          {!data && <UnauthenticatedContent />}
        </DialogContent>
      </Dialog>
    </>
  )
}

function UnauthenticatedContent() {
  return (
    <>
      <div className="w-11/12 text-foreground/60 text-center mx-auto">
        ou can claim some $PEN every day. Connect your wallet to see how much
        $PEN you’re eligible to claim.
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="text-3xl font-bold text-center">*** $PEN</div>
        <div className="text-foreground/50">claimable</div>
      </div>
      <div className="flex items-center justify-center flex-1 -mt-10">
        <WalletConnectButton size="lg">
          Connect wallet to Claim $PEN
        </WalletConnectButton>
      </div>
    </>
  )
}

function AuthenticatedContent() {
  const [isClaiming, setIsClaiming] = useState(false)
  const { data, isLoading } = useDailyClaimCap()
  const { writeContractAsync } = useWriteContract()
  const { address } = useAccount()
  const wagmiConfig = useWagmiConfig()
  let { data: executionFee, error } = useReadContract({
    address: addressMap.DailyClaim,
    abi: dailyClaimAbi,
    functionName: 'executionFee',
  })

  async function checkClaimSuccess() {
    const requests = await readContract(wagmiConfig, {
      address: addressMap.DailyClaim,
      abi: dailyClaimAbi,
      functionName: 'getPendingRequests',
    })

    const userRequests = requests.filter((req) => req.user === address) || []

    // Abort retrying if the resource doesn't exist
    if (userRequests.length > 0) {
      // throw new AbortError('Not success')
      throw new Error('Not success')
    }

    return true
  }

  async function claim() {
    setIsClaiming(true)
    try {
      const hash = await writeContractAsync({
        abi: dailyClaimAbi,
        address: addressMap.DailyClaim,
        functionName: 'createClaimRequest',
        value: executionFee,
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await pRetry(checkClaimSuccess, {
        retries: 20,
        minTimeout: 1000,
        onFailedAttempt(error) {
          console.log('=====error:', error.attemptNumber, error.name)
        },
      })

      toast.success('Claim $PEN successfully')
    } catch (error) {
      console.log('======error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setIsClaiming(false)
  }

  return (
    <>
      <div className="w-11/12 text-foreground/60 text-center mx-auto">
        You can claim $PEN every day. Don’t miss out, claim today’s $PEN airdrop
        now.
      </div>
      {isLoading && <Skeleton className="h-9 w-32 mx-auto" />}
      {data && (
        <div className="flex items-center justify-center gap-2 h-9">
          <div className="text-3xl font-bold text-center">{data.cap} $PEN</div>
          <div className="text-foreground/50">claimable</div>
        </div>
      )}
      <div className="flex items-center justify-center flex-1 -mt-10">
        <Button
          disabled={isClaiming}
          size="lg"
          className="w-40 flex gap-2"
          onClick={claim}
        >
          {isClaiming ? (
            <>
              <div>Claiming</div>
              <LoadingDots />
            </>
          ) : (
            'Claim $PEN'
          )}
        </Button>
      </div>
    </>
  )
}
