import { toast } from 'uikit'
import { appEmitter, ShareEvent } from '@penx/app'
import { encryptString } from '@penx/encryption'
import { copy } from '@penx/shared'
import { trpc } from '~/utils/api'

export function initSharing() {
  appEmitter.on('onShare', (data) => {
    handleSharing(data)
  })
}

const handleSharing = async (data: ShareEvent) => {
  // try {
  //   const sharedDocById = await trpc.sharedDoc.byId.query({ id: data.id })
  //   if (!sharedDocById) {
  //     await trpc.sharedDoc.create.mutate({
  //       id: data.id,
  //       title: data.title,
  //       // content: encryptString(data.content, data.id),
  //       content: '',
  //     })
  //   }
  //   const isCopied = await copy(
  //     `${window.location.origin}/share/${data.id}?key=${data.id}`,
  //   )
  //   if (isCopied) {
  //     toast.info('Copy sharing link successfully')
  //   } else {
  //     throw new Error('Copy failed')
  //   }
  // } catch (error) {
  //   toast.error('Failed to generate sharing link')
  //   console.warn('error:', error)
  // }
}
