'use client'

import { useEffect, useState } from 'react'
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
import { useAddress } from '@/hooks/useAddress'
import { spaceIdAtom } from '@/hooks/useSpaceId'
import { spacesAtom } from '@/hooks/useSpaces'
import { spaceAbi, spaceFactoryAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { SELECTED_SPACE } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api, trpc } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { wagmiConfig } from '@/lib/wagmi'
import { store } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useWriteContract } from 'wagmi'
import { z } from 'zod'
import { FileUpload } from '../FileUpload'
import { NumberInput } from '../NumberInput'
import { Card } from '../ui/card'
import { useCreateSpaceDialog } from './useCreateSpaceDialog'

const FormSchema = z.object({
  logo: z.string().url({
    message: 'Logo is required.',
  }),
  name: z
    .string()
    .min(1, {
      message: 'Name must be at least 1 characters.',
    })
    .max(30, {
      message: 'Name must be no more than 30 characters.',
    }),

  symbolName: z
    .string()
    .min(2, {
      message: 'Symbol name must be at least 2 characters.',
    })
    .max(10, {
      message: 'Name must be no more than 10 characters.',
    }),

  subdomain: z
    .string()
    .min(2, {
      message: 'Subdomain must be at least 2 characters.',
    })
    .max(10, {
      message: 'Name must be no more than 10 characters.',
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
      logo: '',
      name: '',
      symbolName: '',
      subdomain: '',
    },
  })

  const name = form.watch('name')
  const symbolName = form.watch('symbolName')
  const subdomain = form.watch('subdomain')

  useEffect(() => {
    form.setValue(
      'subdomain',
      name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, '-'),
    )

    form.setValue(
      'symbolName',
      name
        .toUpperCase()
        .trim()
        .replace(/[^A-Z]/g, ''),
    )
  }, [name, form])

  useEffect(() => {
    if (!/^[A-Z]+$/.test(symbolName)) {
      form.setValue(
        'symbolName',
        symbolName
          .toUpperCase()
          .trim()
          .replace(/[^A-Z]/g, ''),
      )
    }
  }, [symbolName, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    try {
      const hash = await writeContractAsync({
        address: addressMap.SpaceFactory,
        abi: spaceFactoryAbi,
        functionName: 'createSpace',
        args: [data.name, data.symbolName],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      const spaceAddresses = await readContract(wagmiConfig, {
        address: addressMap.SpaceFactory,
        abi: spaceFactoryAbi,
        functionName: 'getUserSpaces',
        args: [address!],
      })

      const spaceAddress = spaceAddresses[spaceAddresses.length - 1]

      const info = await readContract(wagmiConfig, {
        address: spaceAddress,
        abi: spaceAbi,
        functionName: 'getSpaceInfo',
      })

      const space = await mutateAsync({
        ...data,
        spaceAddress: spaceAddress,
      })

      const spaces = await api.space.mySpaces.query()
      store.set(spacesAtom, spaces)
      store.set(spaceIdAtom, space.id)
      setIsOpen(false)
      toast.success('Space created successfully!')
      revalidateMetadata('spaces')

      localStorage.setItem(SELECTED_SPACE, space.id)
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 pb-20 items-center"
      >
        <Card className="p-4 pb-8 mb-4 space-y-4">
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Logo</FormLabel>
                <FormControl>
                  <FileUpload
                    value={field.value}
                    onChange={async (url) => {
                      field.onChange(url)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Space name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Space Name"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  This is space public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="symbolName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Symbol name</FormLabel>

                <FormControl>
                  <div className="relative">
                    <div className="absolute left-2 top-2 text-secondary-foreground">
                      $
                    </div>
                    <Input
                      placeholder="Pathname"
                      {...field}
                      className="w-full pl-7"
                    />
                  </div>
                </FormControl>

                <FormDescription>
                  Your space token is ${symbolName}.
                </FormDescription>
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
                      @
                    </div>
                    <Input
                      placeholder="Pathname"
                      pattern="[a-zA-Z0-9\-]+"
                      maxLength={32}
                      {...field}
                      className="w-full pl-7"
                    />
                  </div>
                </FormControl>

                <FormDescription>
                  https://{process.env.NEXT_PUBLIC_ROOT_DOMAIN}/@{subdomain}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <Button size="lg" type="submit" className="w-full">
          {isLoading ? <LoadingDots color="#808080" /> : <p>Create Space</p>}
        </Button>
      </form>
    </Form>
  )
}
