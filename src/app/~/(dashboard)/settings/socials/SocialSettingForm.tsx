'use client'

import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { Socials } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@penxio/types'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  farcaster: z.string().optional(),
  x: z.string().optional(),
  mastodon: z.string().optional(),
  github: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  linkedin: z.string().optional(),
  threads: z.string().optional(),
  instagram: z.string().optional(),
  medium: z.string().optional(),
})

interface Props {
  site: Site
}

export function SocialSettingForm({ site }: Props) {
  const { refetch } = trpc.site.getSite.useQuery()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const social = (site.socials || {}) as Socials

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      farcaster: social?.farcaster || '',
      x: social?.x || '',
      mastodon: social?.mastodon || '',
      github: social?.github || '',
      facebook: social?.facebook || '',
      youtube: social?.youtube || '',
      linkedin: social?.linkedin || '',
      threads: social?.threads || '',
      instagram: social?.instagram || '',
      medium: social?.medium || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        socials: {
          farcaster: data.farcaster,
          x: data.x,
          mastodon: data.mastodon,
          github: data.github,
          facebook: data.facebook,
          youtube: data.youtube,
          linkedin: data.linkedin,
          threads: data.threads,
          instagram: data.instagram,
          medium: data.medium,
        },
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
          name="farcaster"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Farcaster</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="x"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>X</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="youtube"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Youtube</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>linkedin</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>GitHub</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button size="lg" type="submit" className="w-20">
            {isPending ? <LoadingDots /> : <p>Save</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
