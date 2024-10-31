'use client'

import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { tipAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { api } from '@/lib/trpc'
import { Post } from '@plantreexyz/types'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import pRetry, { AbortError } from 'p-retry'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { useTipTokenDialog } from './useTipTokenDialog'

interface Props {
  post: Post
}

export function TipTokenDialog({ post }: Props) {
  const { isOpen, isLoading, setIsOpen, setIsLoading, setState } =
    useTipTokenDialog()
  const { address = '' } = useAccount()
  let { data: executionFee } = useReadContract({
    address: addressMap.Tip,
    abi: tipAbi,
    functionName: 'executionFee',
  })

  const { writeContractAsync } = useWriteContract()
  const wagmiConfig = useWagmiConfig()

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
    setIsLoading(true)
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
        args: [address as Address, precision.token(10)],
        value: executionFee,
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      await pRetry(checkTipSuccess, {
        retries: 20,
        minTimeout: 500,
        onFailedAttempt(error) {
          console.log('=====error:', error.attemptNumber, error.name)
        },
      })

      setState({
        isLoading: false,
        isOpen: false,
      })
      toast.success('Tip $TREE successfully')
    } catch (error) {
      console.log('====error>>>:', error)
      setIsLoading(false)

      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[460px] grid gap-4">
        <DialogHeader>
          <DialogTitle className="">Tip $TREE to creator</DialogTitle>
          <DialogDescription>
            Your have 40000 $TREE Allocation to tip creator today.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted rounded-xl p-3 grid gap-1">
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
                plantree.xyz
              </a>
              .
            </li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Button
            size="lg"
            className="w-full flex gap-1"
            disabled={isLoading}
            onClick={tipTokens}
          >
            {isLoading ? (
              <>
                <span className="">Tipping</span>
                <LoadingDots />
              </>
            ) : (
              'Tip $TREE'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
