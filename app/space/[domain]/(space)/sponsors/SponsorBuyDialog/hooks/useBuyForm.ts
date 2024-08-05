import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Space } from '@prisma/client'
import { useSponsorBuyKey } from '../useSponsorBuyKey'
import { useSponsor } from './useSponsor'
import { useSponsorBuyDialog } from './useSponsorBuyDialog'

type Values = {
  name: string
  homeUrl: string
  logo: string
  description: string
}

export function useBuyForm(space: Space) {
  const { setIsOpen } = useSponsorBuyDialog()
  const [isLoading, setLoading] = useState(false)
  const buy = useSponsorBuyKey(space)
  const { data: sponsor } = useSponsor(space.id)

  const form = useForm<Values>({
    defaultValues: {
      logo: '',
      name: '',
      homeUrl: '',
      description: '',
    },
  })

  useEffect(() => {
    if (!sponsor) return
    form.reset({
      logo: sponsor.logo,
      name: sponsor.name,
      homeUrl: sponsor.homeUrl,
      description: sponsor.description,
    })
  }, [sponsor, form])

  const onSubmit: SubmitHandler<Values> = async (data) => {
    setLoading(true)
    await buy(BigInt(space.sponsorCreationId!), data)
    setLoading(false)
    setIsOpen(false)
  }

  return {
    ...form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
  }
}
