'use client'

import { useForm } from 'react-hook-form'
import { PlateEditor } from '@/components/editor/plate-editor'
import { FileUpload } from '@/components/FileUpload'
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
import { Textarea } from '@/components/ui/textarea'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penxio/types'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  logo: z.string(),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  description: z.string(),
  about: z.string(),
})

interface Props {
  site: Site
}

export function SiteSettingForm({ site }: Props) {
  const { refetch } = trpc.site.getSite.useQuery()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      logo: site.logo || '',
      name: site.name || '',
      description: site.description || '',
      about: JSON.stringify(site.about),
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        logo: data.logo,
        name: data.name,
        description: data.description,
        about: data.about,
      })
      refetch()
      toast.success('Site updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center justify-center gap-3">
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => <FileUpload {...field} />}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormDescription>
                This is your public display name.
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
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bio</FormLabel>
              <FormDescription>A brief your introduction.</FormDescription>
              <FormControl>
                <Textarea placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => {
            return (
              <FormItem className="w-full h-full">
                <FormLabel>About</FormLabel>
                <FormControl>
                  <div className="h-[360px]  border border-neutral-200 rounded-lg overflow-auto prose-neutral prose-p:leading-none">
                    <PlateEditor
                      value={JSON.parse(field.value)}
                      onChange={(v) => {
                        field.onChange(JSON.stringify(v))
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
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
