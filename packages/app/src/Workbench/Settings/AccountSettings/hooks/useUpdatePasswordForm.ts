import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useModalContext } from 'uikit'
import { useUser } from '@penx/hooks'
import { api } from '@penx/trpc-client'

export type UseUpdatePasswordFormValues = {
  username: string
  password: string
  passwordConfirm: string
}

export function useUpdatePasswordForm() {
  const { close } = useModalContext()
  const { user } = useUser()

  const [loading, setLoading] = useState(false)
  const form = useForm<UseUpdatePasswordFormValues>({
    defaultValues: {
      username: user.username,
      password: '',
      passwordConfirm: '',
    },
  })

  const onSubmit: SubmitHandler<UseUpdatePasswordFormValues> = async (data) => {
    setLoading(true)
    try {
      console.log('========data:', data)

      await api.user.updateSelfHostedPassword.mutate(data)

      toast.error('Update password successful!')

      close()
    } catch (error) {
      console.log('=========error:', error)

      toast.error('Something went wrong. Please try again later.')
    }
    setLoading(false)
  }

  return { ...form, loading, onSubmit: form.handleSubmit(onSubmit) }
}
