import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useModalContext } from 'uikit'
import { ISpace } from '@penx/types'
import { useSpaceService } from './useSpaceService'

export type CreateSpaceValues = {
  description: string
  name: string
  coverURL: string
}

export function useCreateSpaceForm(onSpaceCreated?: (space: ISpace) => void) {
  const modalContext = useModalContext()
  const { createSpace } = useSpaceService()
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
    const space = await createSpace(data.name)
    onSpaceCreated?.(space)
    modalContext?.close?.()
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
