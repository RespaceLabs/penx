import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, useModalContext } from 'uikit'
import { db, getNewSpace } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export type CreateSpaceValues = {
  name: string
  encrypted: boolean
  password: string
}

export function useCreateSpaceForm() {
  const ctx = useModalContext<boolean>()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
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
      name: data.name,
      encrypted: data.encrypted,
      password: data.password,
    })

    try {
      await trpc.space.create.mutate({
        userId,
        spaceData: JSON.stringify(newSpace),
        encrypted: data.encrypted,
        // nodesData: JSON.stringify(nodes),
      })

      await store.space.createSpace(newSpace)

      ctx?.close?.()
    } catch (error) {
      //
    }

    ctx?.setData?.(false)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
