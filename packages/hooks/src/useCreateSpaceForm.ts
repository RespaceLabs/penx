import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useModalContext } from 'uikit'
import { store } from '@penx/store'
import { ISpace } from '@penx/types'

export type CreateSpaceValues = {
  description: string
  name: string
  coverURL: string
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
    const space = await store.createSpace({ name: data.name })
    onSpaceCreated?.(space)
    modalContext?.close?.()
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
