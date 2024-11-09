'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { SubscriptionType } from '@/app/(creator-fi)/constants'
import { Space } from '@/app/(creator-fi)/domains/Space'
import { useQueryEthBalance } from '@/app/(creator-fi)/hooks/useEthBalance'
import { useTokenBalance } from '@/app/(creator-fi)/hooks/useTokenBalance'
import LoadingDots from '@/components/icons/loading-dots'
import { ProfileAvatar } from '@/components/Profile/ProfileAvatar'
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
import { precision } from '@/lib/math'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { AmountInput } from './AmountInput'
import { TokenSelect } from './TokenSelect'
import { useMemberDialog } from './useMemberDialog'
import { useSubscribe } from './useSubscribe'

interface Props {
  space: Space
}

const FormSchema = z.object({
  type: z.string(),
  token: z.string(),
  times: z.string().min(1, {
    message: 'Times should not be empty.',
  }),
})

export function MemberForm({ space }: Props) {
  const [loading, setLoading] = useState(false)
  useQueryEthBalance()
  const subscribe = useSubscribe(space)
  const { data: tokenBalance } = useTokenBalance()
  const { plan, subscription } = useMemberDialog()

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
    // if (!subscription?.raw) return BigInt(0)

    if (!days) return BigInt(0)
    if (isSubscribe) {
      if (token === 'ETH') {
        return plan.calEthByDuration(days)
      } else {
        return plan.calTokenByDuration(days)
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

    await subscribe(data.token, amount, isSubscribe)

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 sm:max-w-[425px]"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full">
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
                    className="h-full flex-1 bg-accent text-sm font-semibold ring-black data-[state=on]:bg-background dark:data-[state=on]:bg-foreground/60"
                    value={SubscriptionType.SUBSCRIBE}
                  >
                    Subscribe
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value={SubscriptionType.UNSUBSCRIBE}
                    className="h-full flex-1 bg-accent text-sm font-semibold ring-black data-[state=on]:bg-background dark:data-[state=on]:bg-foreground/60"
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

        <div className="flex h-6 items-center justify-between">
          <div className="text-sm text-foreground/60">
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
          {loading ? <LoadingDots /> : 'Confirm'}
        </Button>
      </form>
    </Form>
  )
}

function TokenBalance() {
  const { subscription } = useMemberDialog()

  return (
    <div className="flex items-center gap-1">
      <div className="font-bold">{subscription?.timeFormatted}</div>
    </div>
  )
}
