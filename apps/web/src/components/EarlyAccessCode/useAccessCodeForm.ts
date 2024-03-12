import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { toast } from 'uikit'
import { api } from '@penx/trpc-client'

type Values = {
  code: string
}

export function useAccessCodeForm() {
  const { data, update } = useSession()
  const [loading, setLoading] = useState(false)
  const form = useForm<Values>({
    defaultValues: { code: '' },
  })

  const onSubmit: SubmitHandler<Values> = async ({ code }) => {
    setLoading(true)
    try {
      const isValid = await api.user.isEarlyAccessCodeValid.mutate({ code })

      if (isValid) {
        await update({ earlyAccessCode: code })
      } else {
        toast.error('Invalid early access code')
      }
    } catch (error) {
      toast.error('Invalid early access code')
    }

    setLoading(false)
  }

  return { ...form, loading, onSubmit: form.handleSubmit(onSubmit) }
}
