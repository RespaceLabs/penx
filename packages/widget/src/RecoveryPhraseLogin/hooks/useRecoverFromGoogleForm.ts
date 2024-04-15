import { Dispatch, SetStateAction, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast, useModalContext } from 'uikit'
import {
  GOOGLE_DRIVE_FOLDER_NAME,
  GOOGLE_DRIVE_RECOVERY_PHRASE_FILE,
} from '@penx/constants'
import { decryptString } from '@penx/encryption'
import { GoogleDrive } from '@penx/google-drive'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'

export type BackupFormValues = {
  password: string
  passwordConfirm: string
}

export function useRecoverFromGoogleForm(
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
      const folderName = `${GOOGLE_DRIVE_FOLDER_NAME}-${userId}`
      const fileName = GOOGLE_DRIVE_RECOVERY_PHRASE_FILE

      const folderId = await drive.getOrCreateFolder(folderName)
      const file = await drive.getFileInFolder(folderId, fileName)

      if (file) {
        const decrypted = decryptString(
          file!.encryptedMnemonic,
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
