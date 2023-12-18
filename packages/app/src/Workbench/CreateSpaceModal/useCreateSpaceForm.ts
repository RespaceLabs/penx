import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, useModalContext } from 'uikit'
import { PENX_101_CLOUD_NAME } from '@penx/constants'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { useSession } from '@penx/session'
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
  invitationCode: string
}

export function useCreateSpaceForm(onSpaceCreated?: (space: ISpace) => void) {
  const { data: loading, close, setData } = useModalContext<boolean>()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
      type: SpaceType.LOCAL,
      encrypted: false,
      password: '',
      invitationCode: '',
    },
  })

  const { data: session } = useSession()

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (data) => {
    console.log('data:', data)
    if (data.name === PENX_101_CLOUD_NAME && data.type === SpaceType.CLOUD) {
      toast.info('This is a reserved name. Please choose another one.')
      return
    }

    setData(true)

    if (data.type === SpaceType.CLOUD) {
      if (!session) {
        toast.info('You need to be logged in to create a cloud space')
        setData(false)
        return
      }

      try {
        await trpc.spaceInvitationCode.checkInvitationCode.query(
          data.invitationCode,
        )
      } catch (error) {
        toast.error((error as any)?.message)
        setData(false)
        return
      }
    }

    const space = await store.space.createSpace({
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
          invitationCode: data.invitationCode,
          // nodesData: JSON.stringify(nodes),
        })

        onSpaceCreated?.(space)
        close?.()
      } catch (error) {
        // TODO: if error, should revert local
        await db.deleteSpace(space.id)
      }
    } else {
      onSpaceCreated?.(space)
      close?.()
    }

    setData(false)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
