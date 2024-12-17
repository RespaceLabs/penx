'use client'

import { useEffect, useState } from 'react'
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
import { useAddress } from '@/lib/hooks/useAddress'
import { useCheckChain } from '@/lib/hooks/useCheckChain'
import { spaceFactoryAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { IPFS_ADD_URL } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  readContract,
  readContracts,
  waitForTransactionReceipt,
} from '@wagmi/core'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'
import pRetry, { AbortError } from 'p-retry'
import { toast } from 'sonner'
import { zeroAddress } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'
import { z } from 'zod'
import { FileUpload } from '../FileUpload'
import { useSiteContext } from '../SiteContext'
import { useCreateSpaceDialog } from './useCreateSpaceDialog'

const FormSchema = z.object({
  logo: z.string().min(1, {
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
})

export function CreateSpaceForm() {
  const address = useAddress()
  const site = useSiteContext()
  const checkChain = useCheckChain()
  const [isLoading, setLoading] = useState(false)
  const { push } = useRouter()
  const { setIsOpen } = useCreateSpaceDialog()
  const { writeContractAsync } = useWriteContract()
  const { data: price } = useReadContract({
    address: addressMap.SpaceFactory,
    abi: spaceFactoryAbi,
    functionName: 'price',
  })

  const { data: currentUserSpaces = [] } = useReadContract({
    address: addressMap.SpaceFactory,
    abi: spaceFactoryAbi,
    functionName: 'getUserSpaces',
    args: [address!],
    query: {
      enabled: !address,
    },
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      symbolName: '',
    },
  })

  const name = form.watch('name')
  const symbolName = form.watch('symbolName')

  async function fetchLatestUserSpaces() {
    const spaceAddresses = await readContract(wagmiConfig, {
      address: addressMap.SpaceFactory,
      abi: spaceFactoryAbi,
      functionName: 'getUserSpaces',
      args: [address!],
    })

    if (spaceAddresses.length == currentUserSpaces.length) {
      throw new Error('No get the latest user spaces')
    }

    return spaceAddresses
  }

  useEffect(() => {
    form.setValue(
      'symbolName',
      name
        .toUpperCase()
        .trim()
        .replace(/[^(A-Z|0-9)]/g, ''),
    )
  }, [name, form])

  useEffect(() => {
    if (!/^[A-Z]+$/.test(symbolName)) {
      form.setValue(
        'symbolName',
        symbolName
          .toUpperCase()
          .trim()
          .replace(/[^(A-Z|0-9)]/g, ''),
      )
    }
  }, [symbolName, form])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)

    try {
      await checkChain()

      const res: any = await fetch(IPFS_ADD_URL, {
        method: 'POST',
        body: JSON.stringify({
          logo: data.logo,
        }),
        headers: { 'Content-Type': 'application/json' },
      }).then((d) => d.json())

      console.log('====res:', res, price)

      const hash = await writeContractAsync({
        address: addressMap.SpaceFactory,
        abi: spaceFactoryAbi,
        functionName: 'createSpace',
        args: [
          {
            appId: BigInt(1),
            spaceName: data.name,
            symbol: data.symbolName,
            uri: res.cid,
            preBuyEthAmount: BigInt(0),
            referral: zeroAddress,
          },
        ],
        value: price,
      })

      console.log('======price:', price)

      await waitForTransactionReceipt(wagmiConfig, { hash })

      const spaceAddresses = await pRetry(fetchLatestUserSpaces, {
        retries: 20,
        minTimeout: 500,
        onFailedAttempt(error) {
          console.log('=====error:', error.attemptNumber, error.name)
        },
      })

      const spaceAddress = spaceAddresses[spaceAddresses.length - 1]

      await api.site.updateSite.mutate({
        id: site.id,
        spaceId: spaceAddress,
      })

      toast.success('Space created successfully!')

      // push(`/~/objects/today`)
      // push(`/~/posts`)
      location.href = `/~/posts`

      setIsOpen(false)
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
        className="grid gap-4 items-center"
      >
        <div className="pb-8 space-y-4">
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
                <FormLabel>Site name on chain</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Site name"
                    {...field}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  This is site public display name.
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
                      placeholder="Symbol name"
                      {...field}
                      className="w-full pl-7"
                    />
                  </div>
                </FormControl>

                <FormDescription>
                  Your site token is ${symbolName}.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button size="lg" type="submit" className="w-full">
          {isLoading ? <LoadingDots /> : <p>Enable web3</p>}
        </Button>
      </form>
    </Form>
  )
}
