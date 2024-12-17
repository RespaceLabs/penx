'use client'

import { useForm } from 'react-hook-form'
import { LoadingDots } from '@/components/icons/loading-dots'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useQuerySite } from '@/lib/hooks/useQuerySite'
import { trpc } from '@/lib/trpc'
import { themes } from '@/themes/theme-loader'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penxio/types'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  themeName: z.string().optional(),
})

interface Props {}

export function AppearanceSettingForm({}: Props) {
  const { refetch, site } = useQuerySite()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const form = useForm<z.infer<typeof FormSchema>>({
    defaultValues: {
      themeName: site.themeName || '',
    },
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        themeName: data.themeName,
      })
      refetch()
      toast.success('Updated successfully!')
    } catch (error) {
      console.log('========error:', error)
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="themeName"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-24" disabled={isPending}>
          {isPending ? <LoadingDots /> : 'Submit'}
        </Button>
      </form>
    </Form>
  )
}
