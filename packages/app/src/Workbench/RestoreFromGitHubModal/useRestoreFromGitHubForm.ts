import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, useModalContext } from 'uikit'
import { useUser } from '@penx/hooks'
import { db } from '@penx/local-db'
import { ISpace } from '@penx/model-types'
import { RestoreService } from '@penx/service'
import { store } from '@penx/store'

export type RestoreFromGitHubValues = {
  url: string
  password: string
}

export function useRestoreFromGitHubForm() {
  const modalContext = useModalContext<boolean>()
  const form = useForm<RestoreFromGitHubValues>({
    defaultValues: {
      // url: 'https://github.com/0x-leen/one-test/tree/e8467290adcc789ebe9d23ea8c55200eea2b6259/b0ce0687-f578-498a-95d0-4c660b95d4a3',
      // password: '123',
      url: '',
      password: '',
    },
  })

  const user = useUser()

  const onSubmit: SubmitHandler<RestoreFromGitHubValues> = async (data) => {
    modalContext.setData(true)
    try {
      console.log('data:', data)

      const restoreService = await RestoreService.init(
        user,
        data.url,
        data.password,
      )

      const newSpace = await restoreService.pull()

      console.log('=========newSpace:', newSpace)

      store.space.selectSpace(newSpace.id)

      modalContext.close()
      toast.error('Restore successfully')
    } catch (error) {
      console.log('restore error', error)
      toast.error((error as any).message || 'Restore fail, please try again')
    }
    modalContext.setData(false)
  }

  return { ...form, onSubmit: form.handleSubmit(onSubmit) }
}
