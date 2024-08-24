'use client'

import { useState } from 'react'
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
import { useContributors } from '@/hooks/useContributors'
import { useSpace } from '@/hooks/useSpace'
import { spaceAbi } from '@/lib/abi'
import { checkChain } from '@/lib/checkChain'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
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
})

export function AddContributorForm() {
  const [isLoading, setLoading] = useState(false)
  const { isPending, mutateAsync } = trpc.contributor.create.useMutation()
  const { setIsOpen } = useAddContributorDialog()
  const { space } = useSpace()
  const { contributors = [], refetch } = useContributors()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      address: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await checkChain()
      const some = contributors.find((c) => c.user.address === data.address)

      if (some) {
        setLoading(false)
        return toast.error('This address has already been added.')
      }

      await writeContract(wagmiConfig, {
        address: space.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'addContributor',
        args: [data.address as Address],
      })

      await mutateAsync({
        spaceId: space.id,
        address: data.address,
      })
      refetch()

      setIsOpen(false)
      toast.success('Add Contributor successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to add Contributor. Please try again.')
    }
    setLoading(false)
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

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? <LoadingDots color="#808080" /> : <p>Add</p>}
        </Button>
      </form>
    </Form>
  )
}
