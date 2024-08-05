import { Controller, FormProvider } from 'react-hook-form'
import { FileUpload } from '@/components/FileUpload'
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
import { Space } from '@prisma/client'
import { useBuyForm } from './hooks/useBuyForm'

interface Props {
  space: Space
}

export function SponsorBuyForm({ space }: Props) {
  const form = useBuyForm(space)
  const { control, formState, isLoading } = form
  const { isValid } = formState

  return (
    <FormProvider {...form}>
      <form onSubmit={form.onSubmit} className="grid gap-4">
        <Controller
          name="logo"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field }) => <FileUpload {...field} />}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="homeUrl"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Home URL</FormLabel>
              <FormControl>
                <Input placeholder="Home URL" {...field} className="w-full" />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="Description"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" disabled={!isValid || isLoading}>
          {isLoading ? (
            <LoadingDots color="white" />
          ) : (
            <div>Buy key to sponsor</div>
          )}
        </Button>
      </form>
    </FormProvider>
  )
}
