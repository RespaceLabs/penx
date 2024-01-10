import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, useModalContext } from 'uikit'
import { db, getNewSpace } from '@penx/local-db'
import { EditorMode, ISpace } from '@penx/model-types'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { submitToServer } from '@penx/sync'
import { trpc } from '@penx/trpc-client'

export type CreateSpaceValues = {
  name: string
  editorMode: EditorMode
  encrypted: boolean
  password: string
}

export function useCreateSpaceForm() {
  const ctx = useModalContext<boolean>()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
      editorMode: EditorMode.BLOCK,
      encrypted: false,
      password: '',
    },
  })

  const { data: session } = useSession()

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (data) => {
    console.log('data:', data)

    ctx?.setData?.(true)

    const userId = session?.user?.id ?? ''

    const newSpace = getNewSpace({
      userId,
      editorMode: data.editorMode,
      name: data.name,
      encrypted: data.encrypted,
      password: data.password,
    })

    try {
      await trpc.space.create.mutate({
        userId,
        spaceData: JSON.stringify(newSpace),
        encrypted: data.encrypted,
      })

      const space = await store.space.createSpace(newSpace)

      const nodes = await db.listNodesBySpaceId(space.id)
      await submitToServer(space, nodes)

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
