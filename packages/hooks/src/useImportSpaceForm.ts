import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useModalContext } from 'uikit'
import { SyncStatus } from '@penx/constants'
import { db, getNewSpace } from '@penx/local-db'
import { SyncService } from '@penx/service'
import { trpc } from '@penx/trpc-client'
import { useSpaceService } from './useSpaceService'
import { useSyncStatus } from './useSyncStatus'

export type ImportSpaceValues = {
  githubToken: string
  repo: string
}

export function useImportSpaceForm() {
  const modalContext = useModalContext()
  const { createSpace } = useSpaceService()
  const { setStatus } = useSyncStatus()
  const form = useForm<ImportSpaceValues>({
    defaultValues: {
      githubToken:
        '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',
      repo: 'forsigner/one-test',
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
    const snapshot = await trpc.snapshot.getByRepo.query({ repo: data.repo })

    const newSpace = getNewSpace({
      id: snapshot.spaceId,
      name: data.repo,
    })

    newSpace.settings.extensions['github-sync'].repo = data.repo
    newSpace.settings.extensions['github-sync'].githubToken = data.githubToken

    const space = await db.createSpace(newSpace)

    console.log('space=============:', space)

    // try {
    //   setStatus(SyncStatus.PULLING)
    //   const s = await SyncService.init(space)
    //   await s.pull()
    //   setStatus(SyncStatus.NORMAL)
    // } catch (error) {
    //   setStatus(SyncStatus.PULL_FAILED)
    // }

    // const space = await createSpace(data.name)
    // modalContext?.close?.()
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
