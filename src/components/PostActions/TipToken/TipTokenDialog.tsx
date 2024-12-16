'use client'

import { Dispatch, useEffect, useState } from 'react'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAllocationCap } from '@/hooks/useAllocationCap'
import { useTipInfo } from '@/hooks/useTipInfo'
import { useTipStats } from '@/hooks/useTipStats'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { tipAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { api } from '@/lib/trpc'
import { toFloorFixed } from '@/lib/utils'
import { Post } from '@penxio/types'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { SetStateAction } from 'jotai'
import { useParams } from 'next/navigation'
import pRetry, { AbortError } from 'p-retry'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { TipAmountInput } from './TipAmountInput'

interface Props {
  isLoading: boolean
  isOpen: boolean
  setState: Dispatch<
    SetStateAction<{
      isLoading: boolean
      isOpen: boolean
    }>
  >
  post: Post
  receivers: string[]
}

export function TipTokenDialog({
  isLoading,
  isOpen,
  setState,
  post,
  receivers,
}: Props) {
  const [amount, setAmount] = useState('1')
  const params = useParams()
  const { address = '' } = useAccount()
  let { data: executionFee } = useReadContract({
    address: addressMap.Tip,
    abi: tipAbi,
    functionName: 'executionFee',
  })

  const { refetch: refetchTipStats } = useTipStats(receivers)
  const { refetch: refetchTipInfo } = useTipInfo(post.id, !!params.slug)
  const { data: data, isLoading: isLoadingCap, refetch } = useAllocationCap()

  const { writeContractAsync } = useWriteContract()
  const wagmiConfig = useWagmiConfig()

  useEffect(() => {
    if (!data) return
    setAmount(toFloorFixed(data.cap * 0.1, 2).toString())
  }, [data])

  async function checkTipSuccess() {
    const requests = await readContract(wagmiConfig, {
      address: addressMap.Tip,
      abi: tipAbi,
      functionName: 'getPendingRequests',
    })

    const userRequests = requests.filter((req) => req.tipper === address) || []

    // Abort retrying if the resource doesn't exist
    if (userRequests.length > 0) {
      // throw new AbortError('Not success')
      throw new Error('Not success')
    }

    return true
  }

  async function tipTokens() {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      const address = await api.user.getAddressByUserId.query(post.userId)

      if (!executionFee) {
        executionFee = await readContract(wagmiConfig, {
          address: addressMap.Tip,
          abi: tipAbi,
          functionName: 'executionFee',
        })
      }

      const hash = await writeContractAsync({
        address: addressMap.Tip,
        abi: tipAbi,
        functionName: 'createTipRequest',
        args: [address as Address, precision.token(amount), post.id],
        value: executionFee,
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      await pRetry(checkTipSuccess, {
        retries: 20,
        minTimeout: 1000,
        onFailedAttempt(error) {
          console.log('=====error:', error.attemptNumber, error.name)
        },
      })

      setState({
        isLoading: false,
        isOpen: false,
      })
      toast.success('Tip $PEN successfully')
      await refetch()
      setTimeout(() => {
        if (params?.slug) {
          refetchTipInfo()
        } else {
          refetchTipStats()
        }
      }, 4000)
    } catch (error) {
      console.log('====error>>>:', error)
      setState((prev) => ({ ...prev, isLoading: false }))

      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        setState((prev) => ({ ...prev, isOpen: v }))
      }}
    >
      <DialogContent className="sm:max-w-[460px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Tip $PEN to creator</DialogTitle>
          <DialogDescription>
            Your have {data?.dayCap || '-'} $PEN Allocation to tip creator
            everyday.
          </DialogDescription>
        </DialogHeader>

        {/* <div className="bg-muted rounded-xl p-3 grid gap-1">
          <div className="font-semibold">Who will get tips allocation?</div>
          <DialogDescription>
            You will get tips allocation if you:
          </DialogDescription>
          <ul className="text-foreground list-disc list-inside">
            <li>
              Having a .eth name in{' '}
              <a className="text-brand-500" href="https://ens.domains">
                ens.domains
              </a>
              .
            </li>
            <li>
              Having an account in{' '}
              <a className="text-brand-500" href="https://farcaster.xyz">
                farcaster.xyz
              </a>
              .
            </li>
            <li>
              Linking your socials account to{' '}
              <a className="text-brand-500" href="https://farcaster.xyz">
                penx.io
              </a>
              .
            </li>
          </ul>
        </div> */}

        {!isLoadingCap && data?.cap && (
          <div className="flex items-center justify-between">
            <div className="text-foreground/50 text-sm">Available to tip</div>
            <div>{toFloorFixed(data.cap, 2)} $PEN</div>
          </div>
        )}

        {data && (
          <TipAmountInput
            cap={data.cap}
            value={amount}
            onChange={(value) => {
              setAmount(value)
            }}
          />
        )}

        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="text-foreground/50">Creator rewards</div>
            <div>
              {amount ? `${(Number(amount) * 0.8).toFixed(2)} $PEN` : '-'}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-foreground/50">Your rewards</div>
            <div>
              {amount ? `${(Number(amount) * 0.2).toFixed(2)} $PEN` : '-'}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-full flex gap-1"
            disabled={isLoading || !amount}
            onClick={tipTokens}
          >
            {isLoading ? (
              <>
                <span className="">Tipping</span>
                <LoadingDots />
              </>
            ) : (
              'Tip $PEN'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
