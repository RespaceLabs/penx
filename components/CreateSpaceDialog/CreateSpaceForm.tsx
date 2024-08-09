'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
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
import { spaceIdAtom } from '@/hooks/useSpaceId'
import { spacesAtom } from '@/hooks/useSpaces'
import { SELECTED_SPACE } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api, trpc } from '@/lib/trpc'
import { store } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { Card } from '../ui/card'
import { useCreateSpaceDialog } from './useCreateSpaceDialog'

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),

  subdomain: z.string().min(1, {
    message: 'Subdomain must be at least 2 characters.',
  }),
})

export function CreateSpaceForm() {
  const [isLoading, setLoading] = useState(false)
  const { mutateAsync } = trpc.space.create.useMutation()
  const { push } = useRouter()
  const { setIsOpen } = useCreateSpaceDialog()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      subdomain: '',
    },
  })

  const name = form.watch('name')

  useEffect(() => {
    form.setValue(
      'subdomain',
      name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, '-'),
    )
  }, [name, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    try {
      const space = await mutateAsync({
        ...data,
      })

      const spaces = await api.space.mySpaces.query()
      store.set(spacesAtom, spaces)
      store.set(spaceIdAtom, space.id)
      setIsOpen(false)
      toast.success('Space created successfully!')
      revalidateMetadata('spaces')

      localStorage.setItem(SELECTED_SPACE, space.id)
      push(`/~/space/${space.id}`)
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 pb-20">
        <Card className="p-4 mb-4 flex flex-col gap-4">
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
                {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subdomain"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Space pathname</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Button type="submit" className="w-full">
          {isLoading ? <LoadingDots color="#808080" /> : <p>Create Space</p>}
        </Button>
      </form>
    </Form>
  )
}
