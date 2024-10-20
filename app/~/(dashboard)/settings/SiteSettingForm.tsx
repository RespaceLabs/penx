'use client'

import { useForm } from 'react-hook-form'
import { editorDefaultValue } from '@/app/(creator-fi)/constants'
import Editor from '@/components/editor/advanced-editor'
import { FileUpload } from '@/components/FileUpload'
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
import { Textarea } from '@/components/ui/textarea'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { Socials } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Site } from '@prisma/client'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  logo: z.string(),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  description: z.string(),
  about: z.string(),
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

export function SiteSettingForm({ site }: Props) {
  const { data, refetch } = trpc.site.getSite.useQuery()
  const { isPending, mutateAsync } = trpc.site.updateSite.useMutation()

  const social = (site.socials || {}) as Socials

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      logo: site.logo || '',
      name: site.name || '',
      description: site.description || '',
      about: site.about || '',
      farcaster: social.farcaster || '',
      x: social.x || '',
      mastodon: social.mastodon || '',
      github: social.github || '',
      facebook: social.facebook || '',
      youtube: social.youtube || '',
      linkedin: social.linkedin || '',
      threads: social.threads || '',
      instagram: social.instagram || '',
      medium: social.medium || '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({
        id: site.id,
        logo: data.logo,
        name: data.name,
        description: data.description,
        about: data.about,
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
      toast.success('Site updated successfully!')
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
            name="logo"
            render={({ field }) => <FileUpload {...field} />}
          />
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
          name="description"
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

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem className="w-full h-full">
              <FormLabel>About</FormLabel>
              <FormControl>
                <div className="h-[360px]  border border-neutral-200 rounded-lg overflow-auto prose-neutral prose-p:leading-none">
                  <Editor
                    className="p-3 break-all plan-editor h-full"
                    initialValue={
                      field.value ? JSON.parse(field.value) : editorDefaultValue
                    }
                    onChange={(v) => {
                      field.onChange(JSON.stringify(v))
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Card className="p-4 space-y-4">
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
        </Card>

        <div>
          <Button size="lg" type="submit" className="w-20">
            {isPending ? <LoadingDots color="#808080" /> : <p>Save</p>}
          </Button>
        </div>
      </form>
    </Form>
  )
}
