import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, useModalContext } from 'uikit'
import { db, getNewSpace } from '@penx/local-db'
import { EditorMode, ISpace } from '@penx/model-types'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'

export type CreateSpaceValues = {
  name: string
  editorMode: EditorMode
}

export function useCreateSpaceForm() {
  const ctx = useModalContext<boolean>()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
      editorMode: EditorMode.OUTLINER,
    },
  })

  const { data: session } = useSession()

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (data) => {
    if (!session) {
      toast.error('Please login first')
      return
    }
    console.log('data:', data)

    ctx?.setData?.(true)

    const userId = session?.userId

    const newSpace = getNewSpace({
      userId,
      editorMode: data.editorMode,
      name: data.name,
    })

    try {
      await api.space.create.mutate({
        spaceData: JSON.stringify(newSpace),
      })

      await store.space.createSpace(newSpace)

      ctx?.close?.()
    } catch (error) {
      console.log('========error:', error)

      toast.error('Create space failed!')
    } finally {
      ctx?.setData?.(false)
    }
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
