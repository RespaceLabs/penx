'use client'

import { useForm } from 'react-hook-form'
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
import { updateSpaceById, useSpaces } from '@/hooks/useSpaces'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),

  description: z.string(),
})

export function UpdateSpaceForm() {
  const { space } = useSpaces()
  const { isPending, mutateAsync } = trpc.space.update.useMutation()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: space.name!,
      description: space.description!,
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: space.id,
        ...data,
      })

      updateSpaceById(space.id, data)
      toast.success('Space updated successfully!')
      revalidateMetadata(`${space.subdomain}-metadata`)
      revalidateMetadata('spaces')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to update space. Please try again later.')
    }
  }

  return (
    <div className="max-w-[680px] flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="font-medium">Logo</div>
        <FileUpload
          value={space.logo || ''}
          onChange={async (url) => {
            updateSpaceById(space.id, { logo: url })

            await mutateAsync({ id: space.id, logo: url })
          }}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Space name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Space Name"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  The name of your space. This will be used as the meta title on
                  Google as well.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  The description of your space. This will be used as the meta
                  description on Google as well.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-32">
            {isPending ? <LoadingDots color="#808080" /> : <p>Update Space</p>}
          </Button>
        </form>
      </Form>
    </div>
  )
}
