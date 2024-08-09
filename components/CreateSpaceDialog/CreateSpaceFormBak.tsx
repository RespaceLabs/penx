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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAddress } from '@/hooks/useAddress'
import { spaceIdAtom } from '@/hooks/useSpaceId'
import { spacesAtom, useSpaces } from '@/hooks/useSpaces'
import { indieXAbi } from '@/lib/abi'
import { addressMap } from '@/lib/address'
import { SELECTED_SPACE } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { precision } from '@/lib/math'
import { revalidateMetadata } from '@/lib/revalidateTag'
import { api, trpc } from '@/lib/trpc'
import { wagmiConfig } from '@/lib/wagmi'
import { Curve, CurveService, CurveTypes } from '@/services/CurveService'
import { store } from '@/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import { useWriteContract } from 'wagmi'
import { z } from 'zod'
import { CurveChart, defaultCurve } from '../curve/CurveChart'
import { Card } from '../ui/card'
import { FactorInput } from './FactorInput'
import { useCreateSpaceDialog } from './useCreateSpaceDialog'

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),

  subdomain: z.string().min(1, {
    message: 'Subdomain must be at least 2 characters.',
  }),

  curveType: z.string(),
  basePrice: z.string().min(1, {
    message: 'Basic price must be at least 1 character.',
  }),
  inflectionPoint: z.string().min(1, {
    message: ' must be at least 1 character.',
  }),
  inflectionPrice: z.string().min(1, {
    message: ' must be at least 1 character.',
  }),
  linearPriceSlope: z.string(),
})

const curveService = new CurveService()

export function CreateSpaceForm() {
  const address = useAddress()
  const [isLoading, setLoading] = useState(false)
  const { mutateAsync } = trpc.space.create.useMutation()
  const { push } = useRouter()
  const { setIsOpen } = useCreateSpaceDialog()
  const { writeContractAsync } = useWriteContract()
  const [curve, setCurve] = useState<Curve>(defaultCurve)

  const clubCurve = curveService.getStringFormat('ClubMember')
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      subdomain: '',
      curveType: CurveTypes.ClubMember,
      basePrice: clubCurve.basePrice,
      inflectionPoint: clubCurve.inflectionPoint,
      inflectionPrice: clubCurve.inflectionPoint,
      linearPriceSlope: clubCurve.linearPriceSlope,
    },
  })

  const name = form.watch('name')
  const basePrice = form.watch('basePrice')
  const inflectionPoint = form.watch('inflectionPoint')
  const inflectionPrice = form.watch('inflectionPrice')
  const curveType = form.watch('curveType')

  const debouncedSetCurve = useDebouncedCallback(async (curve) => {
    setCurve(curve)
  }, 400)

  useEffect(() => {
    debouncedSetCurve({
      basePrice: Number(basePrice),
      inflectionPoint: Number(inflectionPoint),
      inflectionPrice: Number(inflectionPrice),
      linearPriceSlope: 0,
    })
  }, [basePrice, inflectionPoint, inflectionPrice, debouncedSetCurve])

  useEffect(() => {
    form.setValue(
      'subdomain',
      name
        .toLowerCase()
        .trim()
        .replace(/[\W_]+/g, '-'),
    )
  }, [name, form])

  useEffect(() => {
    const PublicationMember = curveService.getStringFormat('PublicationMember')
    const ClubMember = curveService.getStringFormat('ClubMember')
    const GithubSponsor = curveService.getStringFormat('GithubSponsor')
    if (curveType === CurveTypes.PublicationMember) {
      form.setValue('basePrice', PublicationMember.basePrice)
      form.setValue('inflectionPoint', PublicationMember.inflectionPoint)
      form.setValue('inflectionPrice', PublicationMember.inflectionPrice)
    }
    if (curveType === CurveTypes.ClubMember) {
      form.setValue('basePrice', ClubMember.basePrice)
      form.setValue('inflectionPoint', ClubMember.inflectionPoint)
      form.setValue('inflectionPrice', ClubMember.inflectionPrice)
    }
    if (curveType === CurveTypes.GithubSponsor) {
      form.setValue('basePrice', GithubSponsor.basePrice)
      form.setValue('inflectionPoint', GithubSponsor.inflectionPoint)
      form.setValue('inflectionPrice', GithubSponsor.inflectionPrice)
    }
  }, [curveType, form])

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
            curve: {
              basePrice: precision.token(data.basePrice, 6),
              inflectionPoint: Number(data.inflectionPoint),
              inflectionPrice: precision.token(data.inflectionPrice, 6),
              linearPriceSlope: BigInt(0),
            },
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 pb-20">
        <div className="font-bold">Basic info</div>
        <Card className="p-4 mb-4">
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
        </Card>

        <div className="font-bold">Bonding curve settings</div>
        <Card className="p-4 space-y-4 mb-4">
          <FormField
            control={form.control}
            name="curveType"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Curve type</FormLabel>
                <FormControl>
                  <ToggleGroup
                    className="gap-3"
                    value={field.value}
                    onValueChange={(v) => {
                      if (!v) return
                      field.onChange(v)
                    }}
                    type="single"
                  >
                    <ToggleGroupItem
                      value={CurveTypes.ClubMember}
                      className="data-[state=on]:ring-2 ring-black bg-accent w-36 text-xs font-semibold"
                    >
                      Club member
                    </ToggleGroupItem>

                    <ToggleGroupItem
                      className="data-[state=on]:ring-2 ring-black bg-accent w-36 text-xs font-semibold"
                      value={CurveTypes.PublicationMember}
                    >
                      Publication Member
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value={CurveTypes.GithubSponsor}
                      className="data-[state=on]:ring-2 ring-black bg-accent w-36 text-xs font-semibold"
                    >
                      Github sponsor
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="basePrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Base price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="0.0" {...field} className="w-full" />
                    <div className="flex items-center justify-center absolute right-0 top-0 h-full px-3">
                      USDC
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inflectionPoint"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Inflection Point</FormLabel>
                <FormControl>
                  <FactorInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="inflectionPrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Inflection Price</FormLabel>
                <FormControl>
                  <FactorInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CurveChart className="mt-4" curve={curve} />
        </Card>
        <Button type="submit" className="w-full">
          {isLoading ? <LoadingDots color="#808080" /> : <p>Create Space</p>}
        </Button>
      </form>
    </Form>
  )
}
