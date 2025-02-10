'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { produce } from 'immer'
import { toast } from 'sonner'
import { z } from 'zod'
import { LoadingDots } from '@/components/icons/loading-dots'
import { useSiteContext } from '@/components/SiteContext'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { defaultNavLinks } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useQuerySite } from '@/lib/hooks/useQuerySite'
import { NavLink, NavLinkType } from '@/lib/theme.types'
import { api } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavLinkDialog } from './useNavLinkDialog'

const FormSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  type: z.nativeEnum(NavLinkType),
  pathname: z.string(),
})

export function NavLinkForm() {
  const [isLoading, setLoading] = useState(false)
  const { setIsOpen, navLink, index } = useNavLinkDialog()
  const { refetch, site } = useQuerySite()
  const navLinks = (site.navLinks || defaultNavLinks) as NavLink[]
  const isEdit = !!navLink

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: isEdit ? navLink.title : '',
      type: isEdit ? navLink.type : ('' as NavLinkType),
      pathname: isEdit ? navLink.pathname : '',
    },
  })

  const type = form.watch('type')

  useEffect(() => {
    form.setValue('title', isEdit ? navLink.title : '')
    form.setValue('type', (isEdit ? navLink.type : '') as any)
    form.setValue('pathname', isEdit ? navLink.pathname : '')
  }, [navLink])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true)
      const newLinks = produce(navLinks, (draft) => {
        if (isEdit) {
          draft[index] = {
            ...navLink,
            ...data,
          }
        } else {
          //
          draft.push({
            ...data,
            visible: true,
          })
        }
      })
      await api.site.updateSite.mutate({
        id: site.id,
        navLinks: newLinks,
      })
      await refetch()
      form.reset()
      setIsOpen(false)
      toast.success('Updated successfully!')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
    setLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isEdit && field.value === NavLinkType.BUILTIN}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem disabled={!isEdit} value={NavLinkType.BUILTIN}>
                    Builtin
                  </SelectItem>
                  <SelectItem value={NavLinkType.PAGE}>Page</SelectItem>
                  <SelectItem value={NavLinkType.TAG}>Tag</SelectItem>
                  <SelectItem value={NavLinkType.CUSTOM}>Custom</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pathname"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Pathname</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  className="w-full"
                  disabled={isEdit && type === NavLinkType.BUILTIN}
                />
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
          {isLoading ? <LoadingDots /> : <span>{isEdit ? 'Save' : 'Add'}</span>}
        </Button>
      </form>
    </Form>
  )
}
