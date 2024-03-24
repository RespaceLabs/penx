import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'uikit'
import { getNewSpace } from '@penx/local-db'
import { EditorMode } from '@penx/model-types'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'

export type CreateSpaceValues = {
  name: string
}

export function useCreateFirstSpaceForm() {
  const [loading, setLoading] = useState(false)
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
    },
  })

  const { data: session } = useSession()

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (data) => {
    const userId = session?.userId

    const newSpace = getNewSpace({
      userId,
      editorMode: EditorMode.BLOCK,
      name: data.name,
    })

    try {
      setLoading(true)
      const space = await api.space.create.mutate({
        spaceData: JSON.stringify(newSpace),
      })

      await store.space.createSpace({
        ...newSpace,
        syncServerId: space.syncServerId as string,
        syncServerUrl: space.syncServerUrl as string,
        syncServerAccessToken: space.syncServerAccessToken as string,
      })
    } catch (error) {
      console.log('========error:', error)

      toast.error('Create space failed!')
    }

    setLoading(false)
  }

  return { ...form, loading, onSubmit: form.handleSubmit(onSubmit) }
}
