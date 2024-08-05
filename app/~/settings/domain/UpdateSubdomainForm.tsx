'use client'

import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
import { Logo } from '@/components/Logo'
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
import { updateSpaceById, useSpaces } from '@/hooks/useSpaces'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  subdomain: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
})

export function UpdateSubdomainForm() {
  const { space } = useSpaces()
  const { isPending, mutateAsync } = trpc.space.update.useMutation()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subdomain: space.subdomain || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: space.id,
        ...data,
      })

      updateSpaceById(space.id, data)
      revalidateMetadata(`${data.subdomain}-metadata`)
      revalidateMetadata('spaces')
      toast.success('Subdomain updated successfully!')
    } catch (error) {
      toast.error(
        extractErrorMessage(error) ||
          'Failed to update subdomain. Please try again!',
      )
    }
  }

  return (
    <div className="max-w-[680px] flex flex-col gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Subdomain</FormLabel>
                <FormControl>
                  <div className="relative">
                    <div className="absolute left-2 top-2 text-secondary-foreground">
                      https://{process.env.NEXT_PUBLIC_ROOT_DOMAIN}/@
                    </div>
                    <Input
                      placeholder="Pathname"
                      pattern="[a-zA-Z0-9\-]+"
                      maxLength={32}
                      {...field}
                      className="w-full text-right"
                    />
                  </div>
                </FormControl>
                <FormDescription>The pathname for your space.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-32">
            {isPending ? <LoadingDots color="#808080" /> : <p>Save changes</p>}
          </Button>
        </form>
      </Form>
    </div>
  )
}
