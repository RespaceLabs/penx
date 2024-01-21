import { SubmitHandler, useForm } from 'react-hook-form'
import { useModalContext } from 'uikit'
import { SyncServerType } from '@penx/constants'
import { trpc } from '@penx/trpc-client'

export type CreateSpaceValues = {
  name: string
  type: SyncServerType
}

export function useCreateSyncServerForm() {
  const ctx = useModalContext<boolean>()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
      type: SyncServerType.PUBLIC,
    },
  })

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (data) => {
    console.log('data:', data)

    ctx?.setData?.(true)

    try {
      await trpc.syncServer.create.mutate(data)

      ctx?.close?.()
    } catch (error) {
      console.log('========error:', error)
    } finally {
      ctx?.setData?.(false)
    }
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
