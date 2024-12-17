import { calculateSHA256FromFile } from './calculateSHA256FromFile'

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

  const res = await fetch(`/static/images/${fileHash}`, {
    method: 'PUT',
    body: file,
  })

  if (res.ok) {
    data = await res.json()
    data = {
      ...data,
      url: `/static/images/${fileHash}`,
    }
  } else {
    throw new Error('Failed to upload file')
  }

  return data as UploadReturn
}
