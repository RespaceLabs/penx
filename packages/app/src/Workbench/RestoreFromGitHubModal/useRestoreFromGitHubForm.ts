import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, useModalContext } from 'uikit'
import { useUser } from '@penx/hooks'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { RestoreService } from '@penx/service'
import { store } from '@penx/store'
import { SyncServerModalData } from '../../SyncServer/SyncServerModal/useSyncServerForm'
import { useSelectedSpace } from '../VersionControl/hooks/useSelectedSpace'
import { RestoreFromGitHubModalData } from '../VersionControl/types'

export type RestoreFromGitHubValues = {
  isOverride: boolean
  password: string
}

export function useRestoreFromGitHubForm() {
  const { setData, data, close } = useModalContext<RestoreFromGitHubModalData>()
  const { space } = useSelectedSpace()
  const form = useForm<RestoreFromGitHubValues>({
    defaultValues: {
      isOverride: false,
    },
  })

  const { user } = useUser()

  const onSubmit: SubmitHandler<RestoreFromGitHubValues> = async (values) => {
    setData({ ...data, loading: true })
    try {
      console.log('data:', values, 'space:', space)

      const mnemonic = store.user.getMnemonic()
      // console.log('==========mnemonic:', mnemonic)

      const restoreService = await RestoreService.init(
        user,
        space,
        data.commitHash,
        mnemonic,
      )

      const newSpace = await restoreService.pull()

      // console.log('=========newSpace:', newSpace)

      store.space.selectSpace(newSpace)

      close()
      toast.error('Restore successfully')
    } catch (error) {
      console.log('restore error', error)
      toast.error((error as any).message || 'Restore fail, please try again')
    }

    setData({ ...data, loading: false })
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
