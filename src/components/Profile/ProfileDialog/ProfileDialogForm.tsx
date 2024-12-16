'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { FileUpload } from '@/components/FileUpload'
import LoadingDots from '@/components/icons/loading-dots'
import { Badge } from '@/components/ui/badge'
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
import { api, trpc } from '@/lib/trpc'
import { store } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useAccount, useWriteContract } from 'wagmi'
import { z } from 'zod'
import { useProfileDialog } from './useProfileDialog'

const FormSchema = z.object({
  image: z.string(),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  bio: z.string(),
})

export function ProfileDialogForm() {
  const { address = '' } = useAccount()
  const { isPending, mutateAsync } = trpc.user.updateProfile.useMutation()
  const { setIsOpen } = useProfileDialog()
  const { data, refetch } = trpc.user.me.useQuery()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: '',
      name: '',
      bio: '',
    },
  })

  useEffect(() => {
    if (!data) return
    form.reset({
      image: data.image || '',
      name: data.name || '',
      bio: data.bio || '',
    })
  }, [data, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync(data)
      refetch()
      setIsOpen(false)
      toast.success('Profile updated successfully!')
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
            name="image"
            render={({ field }) => <FileUpload {...field} />}
          />
          <Badge variant="secondary" className="font-semibold">
            {address}
          </Badge>
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
          name="bio"
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

        <Button size="lg" type="submit" className="w-full">
          {isPending ? <LoadingDots /> : <p>Save</p>}
        </Button>
      </form>
    </Form>
  )
}
