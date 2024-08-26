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
import { useSpace } from '@/hooks/useSpace'
import { useThemes } from '@/hooks/useThemes'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAddThemeDialog } from './useAddContributorDialog'

const FormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

export function AddThemeForm() {
  const [isLoading, setLoading] = useState(false)
  const { mutateAsync } = trpc.theme.create.useMutation()
  const { setIsOpen } = useAddThemeDialog()
  const { space } = useSpace()
  const { refetch } = useThemes()

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
      setLoading(true)
      await mutateAsync({
        spaceId: space.id,
        name: data.name,
        displayName: data.name,
      })
      refetch()

      setIsOpen(false)
      toast.success('Create theme successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to create theme. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? <LoadingDots color="#808080" /> : <p>Confirm</p>}
        </Button>
      </form>
    </Form>
  )
}
