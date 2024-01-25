import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'uikit'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api, trpc } from '@penx/trpc-client'

export type CreateTokenValues = {
  description: string
}

export function useCreateTokenForm() {
  const { refetch } = trpc.personalToken.myPersonalTokens.useQuery()

  const form = useForm<CreateTokenValues>({
    defaultValues: {
      description: '',
    },
  })

  const onSubmit: SubmitHandler<CreateTokenValues> = async (data) => {
    console.log('data:', data)

    try {
      await api.personalToken.create.mutate(data)
      await refetch()
      form.reset()
    } catch (error) {
      toast.error('Create space failed!')
    }
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
