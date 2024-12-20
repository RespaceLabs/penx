import { calculateSHA256FromFile } from './encryption'

type UploadReturn = {
  contentDisposition?: string
  contentType?: string
  pathname?: string
  url?: string
  cid?: string
}

export async function uploadFile(file: File) {
  const fileHash = await calculateSHA256FromFile(file)
  let data: UploadReturn = {}

  const formData = new FormData()
  formData.append('file', file)
  formData.append('from', 'POST')

  const res = await fetch(`/asset/${fileHash}`, {
    method: 'PUT',
    body: formData,
  })

  if (res.ok) {
    data = await res.json()
    data = {
      ...data,
      url: `/asset/${fileHash}`,
    }
  } else {
    throw new Error('Failed to upload file')
  }

  return data as UploadReturn
}
