import { SubmitHandler, useForm } from 'react-hook-form'
import { useModalContext } from 'uikit'
import type { RouterOutputs } from '@penx/api'
import { SyncServerType } from '@penx/constants'
import { trpc } from '@penx/trpc-client'

type SyncServer = RouterOutputs['syncServer']['all']['0']

export type SyncServerModalData = {
  isEditing: boolean
  isLoading: boolean
  syncServer?: SyncServer
}

export type CreateSpaceValues = {
  name: string
  url?: string
  type: SyncServerType
}

export function useSyncServerForm() {
  const { data, setData, close } = useModalContext<SyncServerModalData>()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: data ? data.syncServer?.name : '',
      url: data ? (data.syncServer?.url as string) : '',
      type: data ? (data.syncServer?.type as any) : SyncServerType.PUBLIC,
    },
  })

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (values) => {
    setData?.({ ...data, isLoading: true })

    try {
      if (data.isEditing) {
        await trpc.syncServer.update.mutate({
          ...values,
          id: data.syncServer?.id as string,
        })
      } else {
        await trpc.syncServer.create.mutate(values)
      }

      close?.()
    } catch (error) {
      console.log('========error:', error)
    } finally {
      setData?.({ ...data, isLoading: false })
    }
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
