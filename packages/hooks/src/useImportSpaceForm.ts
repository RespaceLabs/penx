import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useModalContext } from 'uikit'
import { useSpaceService } from './useSpaceService'

export type ImportSpaceValues = {
  githubToken: string
  repo: string
}

export function useImportSpaceForm() {
  const modalContext = useModalContext()
  const { createSpace } = useSpaceService()
  const form = useForm<ImportSpaceValues>({
    defaultValues: {
      githubToken: '',
      repo: '',
    },
    resolver: zodResolver(
      z.object({
        githubToken: z.string().nonempty(),
        repo: z.string().nonempty(),
      }),
    ),
  })

  const onSubmit: SubmitHandler<ImportSpaceValues> = async (data) => {
    console.log('data========:', data)

    // const space = await createSpace(data.name)
    // modalContext?.close?.()
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
