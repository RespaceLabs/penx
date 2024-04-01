import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useModalContext } from 'uikit'
import { encryptString } from '@penx/encryption'
import { GoogleDrive } from '@penx/google-drive'
import { getMnemonicFromLocal } from '@penx/mnemonic'
import { useSession } from '@penx/session'
import { trpc } from '@penx/trpc-client'

export type BackupFormValues = {
  password: string
  passwordConfirm: string
}

export function useCloudBackupForm() {
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

  async function uploadEncryptedRecoveryPhrase(password: string) {
    const accessToken = token?.access_token as string
    const drive = new GoogleDrive(accessToken)
    const folderName = 'PenX_backup'

    let parentId = ''
    let folders = await drive.listByName(folderName)

    if (!folders.length) {
      const folder = await drive.createFolder(folderName)
      parentId = folder.id
    } else {
      parentId = folders[0].id
    }

    const fileName = `recovery_phrase_${userId}.json`
    let files = await drive.listByName(fileName)

    const mnemonic = await getMnemonicFromLocal(session?.secret!)

    const encrypted = encryptString(mnemonic, password + userId)

    if (files.length) {
      await drive.updateJsonContent(files[0].id, { encrypted })
    } else {
      await drive.createJSON(fileName, { encrypted }, parentId)
    }
  }

  const onSubmit: SubmitHandler<BackupFormValues> = async (data) => {
    setLoading(true)
    try {
      await uploadEncryptedRecoveryPhrase(data.password)
      toast.error('Backup to google drive successful!')
      close()
    } catch (error) {
      console.log('=========error:', error)

      toast.error('Something went wrong. Please try again later.')
    }
    setLoading(false)
  }

  return { ...form, loading, onSubmit: form.handleSubmit(onSubmit) }
}
