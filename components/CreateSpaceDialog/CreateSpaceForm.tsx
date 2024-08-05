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
import { useAddress } from '@/hooks/useAddress'
import { spacesAtom, useSpaces } from '@/hooks/useSpaces'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api, trpc } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { store } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'
import { z } from 'zod'
import { useCreateSpaceDialog } from './useCreateSpaceDialog'

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),

  subdomain: z.string().min(1, {
    message: 'Subdomain must be at least 2 characters.',
  }),
})

export function CreateSpaceForm() {
  const address = useAddress()
  const [isLoading, setLoading] = useState(false)
  const { mutateAsync } = trpc.space.create.useMutation()
  const { push } = useRouter()
  const { setIsOpen } = useCreateSpaceDialog()
  const { writeContractAsync } = useWriteContract()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      subdomain: '',
    },
  })

  const name = form.watch('name')

  useEffect(() => {
    form.setValue(
      'subdomain',
      name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, '-'),
    )
  }, [name, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    try {
      const hash = await writeContractAsync({
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'newCreation',
        args: [
          {
            name: data.name!,
            uri: data.subdomain!,
            appId: BigInt(1),
            curatorFeePercent: precision.token(30, 16),
            isFarming: false,
            curve: 0,
            farmer: 0,
            curveArgs: [],
          },
        ],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      const creation = await readContract(wagmiConfig, {
        address: addressMap.IndieX,
        abi: indieXAbi,
        functionName: 'getUserLatestCreation',
        args: [address!],
      })

      const space = await mutateAsync({
        ...data,
        creationId: creation.id.toString(),
      })

      const spaces = await api.space.mySpaces.query()
      store.set(spacesAtom, spaces)
      setIsOpen(false)
      toast.success('Space created successfully!')
      revalidateMetadata('spaces')

      push(`/~/space/${space.id}`)
    } catch (error) {
      console.log('========error:', error)
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
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Space name</FormLabel>
              <FormControl>
                <Input placeholder="Space Name" {...field} className="w-full" />
              </FormControl>
              {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subdomain"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Space pathname</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute left-2 top-2 text-secondary-foreground">
                    https://{process.env.NEXT_PUBLIC_ROOT_DOMAIN}/@
                  </div>
                  <Input
                    placeholder="Pathname"
                    pattern="[a-zA-Z0-9\-]+"
                    maxLength={32}
                    {...field}
                    className="w-full text-right"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {isLoading ? <LoadingDots color="#808080" /> : <p>Create Space</p>}
        </Button>
      </form>
    </Form>
  )
}
