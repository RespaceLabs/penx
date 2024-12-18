'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
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
import { trpc } from '@/lib/trpc'
import useSession from '@/lib/useSession'
import { sleep } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'

const FormSchema = z.object({
  name: z.string().min(4, {
    message: 'Username must be at least 4 characters.',
  }),
  password: z.string().min(4, {
    message: 'Password must be at least 4 characters.',
  }),
})

interface Props {}

export function LoginForm({}: Props) {
  const { login } = useSession()
  const [isLoading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      const result = await login({
        type: 'password',
        username: data.name,
        password: data.password,
      })

      if (result.isLoggedIn) {
        toast.success('Login successfully!')
        location.reload()
      } else {
        toast.error(result.message || 'Login failed!')
      }
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }

    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
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
                <Input placeholder="Password" {...field} className="w-full" />
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
            disabled={isLoading}
          >
            {isLoading ? <LoadingDots /> : <p>Login</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
