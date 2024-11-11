'use client'

import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
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
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penxio/types'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  spaceId: z.string().optional(),
})

interface Props {
  site: Site
}

export function Web3SettingForm({ site }: Props) {
  const { refetch } = trpc.site.getSite.useQuery()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  console.log('====site:', site)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      spaceId: site.spaceId || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        spaceId: data.spaceId,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="spaceId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Space ID</FormLabel>
              <FormDescription>
                Create a space to get a Space ID in: https://www.penx.io
              </FormDescription>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
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
