import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useModalContext } from 'uikit'
import { ISpace } from '@penx/model-types'
import { store } from '@penx/store'

export type CreateSpaceValues = {
  description: string
  name: string
}

export function useCreateSpaceForm(onSpaceCreated?: (space: ISpace) => void) {
  const modalContext = useModalContext()
  const form = useForm<CreateSpaceValues>({
    defaultValues: {
      name: '',
    },
    resolver: zodResolver(
      z.object({
        name: z.string().nonempty(),
      }),
    ),
  })

  const onSubmit: SubmitHandler<CreateSpaceValues> = async (data) => {
    try {
      const space = await store.createSpace({ name: data.name })
      onSpaceCreated?.(space)
      modalContext?.close?.()
    } catch (error) {
      console.log('error', error)
    }
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
