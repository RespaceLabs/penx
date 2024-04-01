import { Dispatch, SetStateAction, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useModalContext } from 'uikit'
import { decryptString } from '@penx/encryption'
import { GoogleDrive } from '@penx/google-drive'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'

export type BackupFormValues = {
  password: string
  passwordConfirm: string
}

export function useRecoverFromGoogle(
  setMnemonic: Dispatch<SetStateAction<string>>,
) {
  const { data: token } = trpc.google.googleDriveToken.useQuery()
  const { data: session } = useSession()
  const { close } = useModalContext()

  const userId = session.userId

  const [loading, setLoading] = useState(false)

  const form = useForm<BackupFormValues>({
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  })

  const onSubmit: SubmitHandler<BackupFormValues> = async (data) => {
    if (!token) return

    setLoading(true)

    try {
      const drive = new GoogleDrive(token.access_token)

      const fileName = `recovery_phrase_${userId}.json`
      let files = await drive.listByName(fileName)

      if (files.length) {
        const file = await drive.getByFileId(files[0].id)

        const decrypted = decryptString(
          file.encrypted,
          data.password + session.userId,
        )

        if (!decrypted) {
          toast.error('Password is invalid!')
        } else {
          setMnemonic(decrypted)
          close()
        }
      } else {
        toast.success('No backup found!')
      }
    } catch (error) {
      console.log('=========error:', error)

      toast.error('Something went wrong. Please try again later.')
    }
    setLoading(false)
  }

  return { ...form, loading, onSubmit: form.handleSubmit(onSubmit) }
}
