'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { SECONDS_PER_DAY } from '@/domains/Space'
import { Subscription } from '@/domains/Subscription'
import { useChainSpace } from '@/hooks/useChainSpace'
import { useQueryEthBalance } from '@/hooks/useEthBalance'
import { useSubscription } from '@/hooks/useSubscription'
import { useTokenBalance } from '@/hooks/useTokenBalance'
import { SubscriptionType, TradeType } from '@/lib/constants'
import { precision } from '@/lib/math'
import { RouterOutputs } from '@/server/_app'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import LoadingDots from '../icons/loading-dots'
import { ProfileAvatar } from '../Profile/ProfileAvatar'
import { AmountInput } from './AmountInput'
import { TokenSelect } from './TokenSelect'
import { useMemberDialog } from './useMemberDialog'
import { useSubscribe } from './useSubscribe'

interface Props {
  space: RouterOutputs['space']['byId']
}

const FormSchema = z.object({
  type: z.string(),
  token: z.string(),
  times: z.string().min(1, {
    message: 'Times should not be empty.',
  }),
})

export function MemberForm({ space }: Props) {
  const { setIsOpen } = useMemberDialog()
  const [loading, setLoading] = useState(false)
  useQueryEthBalance()
  const trade = useSubscribe(space)
  const { space: chainSpace } = useChainSpace()
  const { subscription } = useSubscription()
  const { data: tokenBalance } = useTokenBalance()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: SubscriptionType.SUBSCRIBE,
      token: 'ETH',
      times: '180', // 180 days by default
    },
  })

  const isSubscribe = form.watch('type') === SubscriptionType.SUBSCRIBE
  const token = form.watch('token')
  const times = form.watch('times')

  const getAmount = (token: string, days: string, isSubscribe: boolean) => {
    if (!days) return BigInt(0)
    if (isSubscribe) {
      if (token === 'ETH') {
        return chainSpace.calEthByDuration(days)
      } else {
        return chainSpace.calTokenByDuration(days)
      }
    }

    return subscription.getAmountByDays(days)
  }

  const cost = getAmount(token, times, isSubscribe)
  const unit = useMemo(() => {
    if (!isSubscribe) return space.symbolName
    return token == 'ETH' ? 'ETH' : space.symbolName
  }, [isSubscribe, token, space.symbolName])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const isSubscribe = data.type === SubscriptionType.SUBSCRIBE

    setLoading(true)
    const amount = getAmount(data.token, data.times, isSubscribe)

    if (data.token !== 'ETH') {
      if (amount > tokenBalance!) {
        toast.warning(`Insufficient $${space.symbolName} balance`)
        setLoading(false)
        return
      }
    }

    const duration = Number(data.times) * Number(SECONDS_PER_DAY)
    await trade(data.token, amount, isSubscribe, duration)
    setLoading(false)
    setIsOpen(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="sm:max-w-[425px] grid gap-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <ToggleGroup
                  className="gap-3 bg-accent p-1 rounded-lg h-11"
                  value={field.value}
                  onValueChange={(v) => {
                    if (!v) return
                    field.onChange(v)
                  }}
                  type="single"
                >
                  <ToggleGroupItem
                    className="data-[state=on]:bg-white ring-black bg-accent text-sm font-semibold flex-1 h-full"
                    value={SubscriptionType.SUBSCRIBE}
                  >
                    Subscribe
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value={SubscriptionType.UNSUBSCRIBE}
                    className="data-[state=on]:bg-white ring-black bg-accent text-sm font-semibold flex-1 h-full"
                  >
                    Unsubscribe
                  </ToggleGroupItem>
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <ProfileAvatar showAddress />
          <TokenBalance />
        </div>

        <div className="space-y-1">
          <div>{isSubscribe ? 'Subscribe' : 'Unsubscribe'} days</div>

          <FormField
            control={form.control}
            name="times"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <AmountInput
                    isSubscribe={isSubscribe}
                    value={field.value}
                    onChange={(v) => {
                      // setAmount(v)
                      field.onChange(v)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isSubscribe && (
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TokenSelect {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex items-center justify-between h-6">
          <div className="text-sm text-neutral-500">
            Total {isSubscribe ? 'cost' : 'refund'}
          </div>
          <div className="text-sm">
            {precision.toDecimal(cost).toFixed(6)} {unit}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={loading || !form.formState.isValid}
        >
          {loading ? <LoadingDots color="white" /> : 'Confirm'}
        </Button>
      </form>
    </Form>
  )
}

function TokenBalance() {
  const { data, isLoading } = useSubscription()
  if (isLoading) return null
  const subscription = new Subscription(data!)

  return (
    <div className="flex items-center gap-1">
      <div className="font-bold">{subscription.timeFormatted}</div>
    </div>
  )
}
