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
}

export function useCreateSpaceForm(onSpaceCreated?: (space: ISpace) => void) {
  const modalContext = useModalContext()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
      type: SpaceType.LOCAL,
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
      })

      if (data.type === SpaceType.CLOUD) {
        const nodes = await db.listNormalNodes(space.id)

        console.log('space=====:', space)

        try {
          await trpc.space.create.mutate({
            userId: session?.userId as string,
            spaceData: JSON.stringify(space),
            nodesData: JSON.stringify(nodes),
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
