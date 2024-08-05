'use client'

import { useForm } from 'react-hook-form'
import LoadingDots from '@/components/icons/loading-dots'
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
import { useSpaceId } from '@/hooks/useSpaceId'
import { refetchSpaces } from '@/hooks/useSpaces'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { router } from '@/server/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

export function DeleteSpaceForm({ spaceName }: { spaceName: string }) {
  const { push } = useRouter()
  const { isPending, mutateAsync } = trpc.space.delete.useMutation()
  const { spaceId } = useSpaceId()

  const FormSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: 'Name must be at least 1 characters.',
      })
      .regex(new RegExp(`^${spaceName}$`, 'i'), {
        message: 'Name does not match.',
      }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync({ id: spaceId })
      await refetchSpaces()
      toast.success('Space deleted successfully!')
      push('/~/discover')
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg || 'Failed to delete space.')
    }
  }

  return (
    <Form {...form}>
      <form
        className="rounded-lg border"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
          <h2 className="font-cal text-xl dark:text-white">Delete Site</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormDescription>
                  Deletes your space and all posts associated with it. Type in
                  the name of your space <b>{spaceName}</b> to confirm.
                </FormDescription>
                <FormControl>
                  <Input
                    // pattern={spaceName}
                    placeholder={spaceName}
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
          <p className="text-center text-sm text-stone-500 dark:text-stone-400">
            This action is irreversible. Please proceed with caution.
          </p>

          <Button
            type="submit"
            className="w-32"
            disabled={!form.formState.isValid}
            variant="destructive"
          >
            {isPending ? <LoadingDots color="white" /> : 'Delete Space'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
