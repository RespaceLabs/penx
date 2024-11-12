'use client';

import { useForm } from 'react-hook-form';
import LoadingDots from '@/components/icons/loading-dots';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { extractErrorMessage } from '@/lib/extractErrorMessage';
import { trpc } from '@/lib/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { Site } from '@penxio/types';
import { AuthType } from '@prisma/client';
import { toast } from 'sonner';
import { z } from 'zod';


const FormSchema = z.object({
  authType: z.nativeEnum(AuthType),
  privyAppId: z.string().optional(),
  privyAppSecret: z.string().optional(),
})

interface Props {
  site: Site
}

export function AuthTypeSettingForm({ site }: Props) {
  const { refetch } = trpc.site.getSite.useQuery()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const authConfig = site.authConfig as any
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      authType: site.authType!,
      privyAppId: authConfig?.privyAppId || '',
      privyAppSecret: authConfig?.privyAppSecret || '',
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        authType: data.authType,
        authConfig: {
          privyAppId: data.privyAppId,
          privyAppSecret: data.privyAppSecret,
        },
      })
      refetch()
      toast.success('Updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  const authType = form.watch('authType')
  const isPrivy = authType === AuthType.PRIVY

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="authType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Auth type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center gap-10"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AuthType.REOWN} />
                    </FormControl>
                    <FormLabel className="font-normal">Wallet (web3)</FormLabel>
                  </FormItem>
                  {/* <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AuthType.PRIVY} />
                    </FormControl>
                    <FormLabel className="font-normal">Privy</FormLabel>
                  </FormItem> */}
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={AuthType.GOOGLE} />
                    </FormControl>
                    <FormLabel className="font-normal">Google</FormLabel>
                    <FormDescription>(Web2)</FormDescription>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isPrivy && (
          <FormField
            control={form.control}
            name="privyAppId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Privy App ID</FormLabel>
                <FormDescription>
                  Get App ID in https://dashboard.privy.io
                </FormDescription>
                <FormControl>
                  <Input placeholder="" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {isPrivy && (
          <FormField
            control={form.control}
            name="privyAppSecret"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Privy App Secret</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-24" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}