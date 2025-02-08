'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useMyAccounts } from '@/lib/hooks/useMyAccounts'
import { trpc } from '@/lib/trpc'
import { sleep } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { usePasswordDialog } from './usePasswordDialog'

const FormSchema = z.object({
  username: z.string().min(4, {
    message: 'Username must be at least 4 characters.',
  }),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.',
  }),
})

interface Props {}

export function PasswordForm({}: Props) {
  const { setIsOpen } = usePasswordDialog()
  const { refetch } = useMyAccounts()
  const { isPending, mutateAsync } = trpc.user.linkPassword.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        username: data.username,
        password: data.password,
      })
      await refetch()
      setIsOpen(false)
      toast.success('Set password successfully')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Username" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? <LoadingDots /> : <p>Confirm</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
