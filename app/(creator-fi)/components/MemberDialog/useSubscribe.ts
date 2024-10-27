import { Space } from '@/app/(creator-fi)/domains/Space'
import { useAddress } from '@/app/(creator-fi)/hooks/useAddress'
import { useMembers } from '@/app/(creator-fi)/hooks/useMembers'
import { refetchSpaces } from '@/app/(creator-fi)/hooks/useSpaces'
import { useSubscriptions } from '@/app/(creator-fi)/hooks/useSubscriptions'
import { useCheckChain } from '@/hooks/useCheckChain'
import { useWagmiConfig } from '@/hooks/useWagmiConfig'
import { erc20Abi, spaceAbi } from '@/lib/abi'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { useMemberDialog } from './useMemberDialog'

export function useSubscribe(space: Space) {
  const members = useMembers()
  const { writeContractAsync } = useWriteContract()
  const address = useAddress()
  const subscription = useSubscriptions()
  const { setIsOpen, plan } = useMemberDialog()
  const { push } = useRouter()
  const params = useSearchParams()
  const postSlug = params.get('post_slug')
  const { update } = useSession()
  const wagmiConfig = useWagmiConfig()
  const checkChain = useCheckChain()

  return async (token: string, amount: bigint, isSubscribe: boolean) => {
    const spaceAddress = space.address as Address

    try {
      await checkChain()
      if (isSubscribe) {
        let hash: any = ''

        console.log('====amount:', amount)

        if (token === 'ETH') {
          hash = await writeContractAsync({
            address: spaceAddress,
            abi: spaceAbi,
            functionName: 'subscribeByEth',
            args: [plan.id, ''],
            value: amount,
          })
        } else {
          const approveTx = await writeContractAsync({
            address: spaceAddress,
            abi: erc20Abi,
            functionName: 'approve',
            args: [spaceAddress, amount],
          })

          await waitForTransactionReceipt(wagmiConfig, { hash: approveTx })

          hash = await writeContractAsync({
            address: spaceAddress,
            abi: spaceAbi,
            functionName: 'subscribe',
            args: [plan.id, amount, ''],
          })
        }

        await waitForTransactionReceipt(wagmiConfig, { hash })
      } else {
        const hash = await writeContractAsync({
          address: spaceAddress,
          abi: spaceAbi,
          functionName: 'unsubscribe',
          args: [plan.id, amount],
        })

        await waitForTransactionReceipt(wagmiConfig, { hash })
      }

      // TODO:
      // const info = await readContract(wagmiConfig, {
      //   address: space.address as Address,
      //   abi: spaceAbi,
      //   functionName: 'getSubscription',
      //   args: [0, address],
      // })

      const subscriptions = await readContract(wagmiConfig, {
        address: space.address as Address,
        abi: spaceAbi,
        functionName: 'getSubscriptions',
        args: [],
      })

      const info = subscriptions.find(
        (sub) => sub.planId === plan.id && sub.account === address,
      )!

      await Promise.all([
        subscription.refetch(),
        members.refetch(),
        refetchSpaces(),
      ])

      if (postSlug) {
        if (typeof update === 'function') {
          await update({ address })
        }
        push(`/posts/${postSlug}`)
      }

      if (isSubscribe) {
        toast.success('Subscribe successful!')
      } else {
        toast.success('Unsubscribe successful!')
      }

      setIsOpen(false)
    } catch (error) {
      console.log('=======>>>>error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    } finally {
      //
    }
  }
}
