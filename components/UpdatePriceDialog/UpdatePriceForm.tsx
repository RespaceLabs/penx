'use client'

import { useEffect, useMemo } from 'react'
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
import { useChainSpace, useQueryChainSpace } from '@/hooks/useChainSpace'
import { useEthPrice } from '@/hooks/useEthPrice'
import { useSpace } from '@/hooks/useSpace'
import { spaceAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { checkChain } from '@/lib/checkChain'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { waitForTransactionReceipt } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { useWriteContract } from 'wagmi'
import { z } from 'zod'
import { NumberInput } from '../NumberInput'
import { useUpdatePriceDialog } from './useUpdatePriceDialog'

const FormSchema = z.object({
  price: z.string().min(1, {
    message: 'price must be at least 1 characters.',
  }),
})

export function UpdatePriceForm() {
  const { isPending, writeContractAsync } = useWriteContract()
  const { setIsOpen } = useUpdatePriceDialog()
  const { space } = useSpace()
  const { space: chainSpace } = useChainSpace()
  const { ethPrice } = useEthPrice()
  const { refetch } = useQueryChainSpace()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      price: '',
    },
  })

  useEffect(() => {
    if (ethPrice && chainSpace?.symbolName) {
      form.setValue('price', chainSpace?.getUsdPrice(ethPrice).toFixed(2))
    }
  }, [chainSpace, ethPrice, form])

  const price = form.watch('price')
  const priceBuyPrice = useMemo(() => {
    if (!price || !ethPrice) return 0
    return Number(price) / ethPrice
  }, [price, ethPrice])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await checkChain()
      const hash = await writeContractAsync({
        address: space.spaceAddress as Address,
        abi: spaceAbi,
        functionName: 'setSubscriptionPrice',
        args: [precision.token(Number(data.price) / ethPrice)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      await refetch()
      setIsOpen(false)

      toast.success('Channel created successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to update price. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Subscription price (${price || '0'}/month) =
                {priceBuyPrice.toFixed(5)} ETH
              </FormLabel>
              <FormControl>
                <NumberInput
                  placeholder=""
                  autoFocus
                  precision={2}
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!form.formState.isValid}
        >
          {isPending ? <LoadingDots color="#808080" /> : <p>Save</p>}
        </Button>
      </form>
    </Form>
  )
}
