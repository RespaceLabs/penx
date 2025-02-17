'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
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
import { Input } from '@/components/ui/input'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useQuerySite } from '@/lib/hooks/useQuerySite'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'

const FormSchema = z.object({
  gaMeasurementId: z.string().optional(),
  umamiHost: z.string().optional(),
  umamiWebsiteId: z.string().optional(),
})

interface Props {}

export function AnalyticsSettingForm({}: Props) {
  const { refetch, site } = useQuerySite()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()
  const analytics = (site.analytics || {}) as z.infer<typeof FormSchema>
  site.socials

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gaMeasurementId: analytics?.gaMeasurementId || '',
      umamiHost: analytics?.umamiHost || 'https://cloud.umami.is',
      umamiWebsiteId: analytics?.umamiWebsiteId || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        analytics: data,
      })
      refetch()
      toast.success('Updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-6"
      >
        <h2 className="text-lg font-bold -mb-3">Google Analytics</h2>
        <FormField
          control={form.control}
          name="gaMeasurementId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Google Analytics Measurement ID</FormLabel>
              <FormDescription>
                Use a GA4 measurement ID to track page views and conversion.
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="e.g. G-XXXXXXXXXX"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className="text-lg font-bold -mb-3 mt-4">Umami Analytics</h2>

        <FormField
          control={form.control}
          name="umamiHost"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Umami host</FormLabel>
              <FormDescription>
                Default is official Umami host (https://cloud.umami.is), but you
                can use your own.
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="umamiWebsiteId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Umami website ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="lg" type="submit" className="w-20">
            {isPending ? <LoadingDots /> : <p>Save</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
