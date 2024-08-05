'use client'

import { useEffect } from 'react'
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
import { channelsAtom } from '@/hooks/useChannels'
import { useSpaces } from '@/hooks/useSpaces'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { store } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useCreateChannelDialog } from './useCreateChannelDialog'

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
})

export function CreateChannelForm() {
  const { isPending, mutateAsync } = trpc.channel.create.useMutation()
  const { setIsOpen } = useCreateChannelDialog()
  const { space } = useSpaces()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  const name = form.watch('name')

  useEffect(() => {
    const newValue = name
      .toLowerCase()
      .trim()
      .replace(/[\W_]+/g, '-')
    if (name !== newValue) form.setValue('name', newValue)
  }, [name, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        spaceId: space.id,
        name: data.name,
      })

      const channels = await api.channel.listBySpaceId.query(space.id)
      store.set(channelsAtom, channels)
      setIsOpen(false)
      toast.success('Channel created successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create channel. Please try again.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Chanel name</FormLabel>
              <FormControl>
                <Input
                  placeholder="New Channel"
                  pattern="[a-zA-Z0-9\-]+"
                  maxLength={32}
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {isPending ? <LoadingDots color="#808080" /> : <p>Create Channel</p>}
        </Button>
      </form>
    </Form>
  )
}
