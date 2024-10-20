'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumberInput } from '@/app/(creator-fi)/components/NumberInput'
import { editorDefaultValue } from '@/app/(creator-fi)/constants'
import { useEthPrice } from '@/app/(creator-fi)/hooks/useEthPrice'
import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
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
import { spaceAbi } from '@/lib/abi'
import { addToIpfs } from '@/lib/addToIpfs'
import { checkChain } from '@/lib/checkChain'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { wagmiConfig } from '@/lib/wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { toast } from 'sonner'
import { Address } from 'viem'
import { z } from 'zod'
import { useAddPlanDialog } from './useAddPlanDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Plan name is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
})

export function AddPlanForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useAddPlanDialog()
  const { space } = useSpace()
  const { ethPrice } = useEthPrice()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      price: '',
    },
  })

  const price = form.watch('price')
  const priceBuyPrice = useMemo(() => {
    if (!price || !ethPrice) return 0
    return Number(price) / ethPrice
  }, [price, ethPrice])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      await checkChain()

      const cid = await addToIpfs(
        JSON.stringify({
          name: data.name,
          benefits: JSON.stringify(editorDefaultValue),
        }),
      )

      const price = precision.token(Number(data.price) / ethPrice)
      const hash = await writeContract(wagmiConfig, {
        address: space.address as Address,
        abi: spaceAbi,
        functionName: 'createPlan',
        args: [cid, price, BigInt(0)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      setIsOpen(false)
      toast.success('Add Plan successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to add plan. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Plan name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? <LoadingDots color="#808080" /> : <p>Add</p>}
        </Button>
      </form>
    </Form>
  )
}
