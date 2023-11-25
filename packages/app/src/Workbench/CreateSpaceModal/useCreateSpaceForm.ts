import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { toast, useModalContext } from 'uikit'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'

export enum SpaceType {
  CLOUD = 'CLOUD',
  LOCAL = 'LOCAL',
}

export type CreateSpaceValues = {
  name: string
  type: SpaceType
  encrypted: boolean
  password: string
}

export function useCreateSpaceForm(onSpaceCreated?: (space: ISpace) => void) {
  const modalContext = useModalContext()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
      type: SpaceType.LOCAL,
      encrypted: false,
      password: '',
    },
  })

  const { data: session, status } = useSession()

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (data) => {
    try {
      console.log('data:', data)

      if (data.type === SpaceType.CLOUD && status === 'unauthenticated') {
        toast.info('You need to be logged in to create a cloud space')
        return
      }

      const space = await store.createSpace({
        name: data.name,
        isCloud: data.type === SpaceType.CLOUD,
        encrypted: data.encrypted,
        password: data.password,
      })

      if (data.type === SpaceType.CLOUD) {
        try {
          await trpc.space.create.mutate({
            userId: session?.userId as string,
            spaceData: JSON.stringify(space),
            encrypted: data.encrypted,
            // nodesData: JSON.stringify(nodes),
          })

          onSpaceCreated?.(space)
          modalContext?.close?.()
        } catch (error) {
          // TODO: if error, show revert local
        }
      } else {
        onSpaceCreated?.(space)
        modalContext?.close?.()
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
