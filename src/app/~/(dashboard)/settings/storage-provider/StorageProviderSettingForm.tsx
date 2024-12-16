'use client'

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
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penxio/types'
import { StorageProvider } from '@prisma/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  storageProvider: z.nativeEnum(StorageProvider),
  vercelBlobToken: z.string().optional(),
})

interface Props {
  site: Site
}

export function StorageProviderSettingForm({ site }: Props) {
  const { refetch } = trpc.site.getSite.useQuery()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const storageConfig = site.storageConfig as any
  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      storageProvider: site.storageProvider!,
      vercelBlobToken: storageConfig?.vercelBlobToken || '',
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        storageProvider: data.storageProvider,
        storageConfig: {
          vercelBlobToken: data.vercelBlobToken,
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

  const storageProvider = form.watch('storageProvider')
  const isVercelBlob = storageProvider === StorageProvider.VERCEL_BLOB

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="storageProvider"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Storage provider</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center justify-between"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StorageProvider.IPFS} />
                    </FormControl>
                    <FormLabel className="font-normal">Ipfs</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={StorageProvider.VERCEL_BLOB} />
                    </FormControl>
                    <FormLabel className="font-normal">Vercel Blob</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem
                        disabled
                        value={StorageProvider.SUPABASE_STORAGE}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Supabase Storage
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isVercelBlob && (
          <FormField
            control={form.control}
            name="vercelBlobToken"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>BLOB_READ_WRITE_TOKEN</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} className="w-full" />
                </FormControl>
                <FormDescription>
                  Setup instructions:
                  https://vercel.com/docs/storage/vercel-blob/quickstart
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
