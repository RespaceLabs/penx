'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import Editor from '@/app/(creator-fi)/components/editor/advanced-editor'
import { NumberInput } from '@/app/(creator-fi)/components/NumberInput'
import { PlanStatus } from '@/app/(creator-fi)/domains/Plan'
import { useEthPrice } from '@/app/(creator-fi)/hooks/useEthPrice'
import { usePlans } from '@/app/(creator-fi)/hooks/usePlans'
import { useSpace } from '@/app/(creator-fi)/hooks/useSpace'
import LoadingDots from '@/app/(creator-fi)/loading/loading-dots'
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
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
import { useUpdatePlanDialog } from './useUpdatePlanDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Plan name is required' }),
  price: z.string().min(1, { message: 'Price is required' }),
  status: z.string(),
  benefits: z.string().min(1, { message: 'Benefits is required' }),
})

export function UpdatePlanForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen } = useUpdatePlanDialog()
  const { space } = useSpace()
  const { ethPrice } = useEthPrice()
  const { plan } = useUpdatePlanDialog()
  const { refetch } = usePlans()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      status: plan.status,
      name: plan.name,
      price: plan.getUsdPrice(ethPrice).toFixed(2),
      benefits: plan.benefits,
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
          benefits: data.benefits,
        }),
      )

      const price = precision.token(Number(data.price) / ethPrice)
      const hash = await writeContract(wagmiConfig, {
        address: space.address as Address,
        abi: spaceAbi,
        functionName: 'updatePlan',
        args: [
          plan.id,
          cid,
          price,
          BigInt(0),
          data.status === PlanStatus.ACTIVE,
        ],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await refetch()
      setIsOpen(false)
      toast.success('Update plan successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to update plan. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex gap-8">
          <div className="flex-1 flex-shrink-0 space-y-6">
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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      className="h-11 gap-3 rounded-lg bg-accent p-1"
                      value={field.value}
                      onValueChange={(v) => {
                        if (!v) return
                        field.onChange(v)
                      }}
                      type="single"
                    >
                      <ToggleGroupItem
                        className="h-full flex-1 bg-accent text-sm font-semibold ring-black data-[state=on]:bg-white"
                        value={PlanStatus.ACTIVE}
                      >
                        Active
                      </ToggleGroupItem>

                      <ToggleGroupItem
                        value={PlanStatus.INACTIVE}
                        className="h-full flex-1 bg-accent text-sm font-semibold ring-black data-[state=on]:bg-white"
                      >
                        Inactive
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex-1 flex-shrink-0">
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem className="h-full w-full">
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <div className="h-[360px]  overflow-auto rounded-lg border border-neutral-200">
                      <Editor
                        className="plan-editor break-all p-3"
                        initialValue={JSON.parse(field.value)}
                        onChange={(v) => {
                          field.onChange(JSON.stringify(v))
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button
            className="w-64"
            type="submit"
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? <LoadingDots color="#808080" /> : <p>Update</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
