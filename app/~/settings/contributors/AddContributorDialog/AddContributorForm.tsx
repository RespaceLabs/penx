'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { channelsAtom } from '@/hooks/useChannels'
import { useSpaces } from '@/hooks/useSpaces'
import { spaceAbi } from '@/lib/abi/indieX'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { store } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { readContract, writeContract } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { z } from 'zod'
import { useAddContributorDialog } from './useAddContributorDialog'

const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/

const FormSchema = z.object({
  address: z
    .string()
    .min(1, { message: 'Address is required' })
    .regex(ethAddressRegex, { message: 'Invalid Ethereum address' }),
  share: z
    .string()
    .min(1, { message: 'Share cannot be empty' })
    .regex(/^\d+$/, { message: 'Share must be a numeric string' }),
})

export function AddContributorForm() {
  const { isPending, mutateAsync } = trpc.contributor.create.useMutation()
  const { setIsOpen } = useAddContributorDialog()
  const { space } = useSpaces()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: '',
      share: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        spaceId: space.id,
        address: data.address,
        share: data.share,
      })

      await writeContract(wagmiConfig, {
        address: space.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'addContributor',
        args: [
          {
            account: data.address as Address,
            share: BigInt(data.share),
          },
        ],
      })

      // const channels = await api.channel.listBySpaceId.query(space.id)
      // store.set(channelsAtom, channels)
      setIsOpen(false)
      toast.success('Add Contributor successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to add Contributor. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Wallet address</FormLabel>
              <FormControl>
                <Input placeholder="0x..." {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="share"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Share</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isPending ? <LoadingDots color="#808080" /> : <p>Add</p>}
        </Button>
      </form>
    </Form>
  )
}
