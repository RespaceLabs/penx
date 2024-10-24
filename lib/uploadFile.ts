import { calculateSHA256FromFile } from './calculateSHA256FromFile'
import { uploadToGoogleDrive } from './uploadToGoogleDrive'

type UploadReturn = {
  contentDisposition: string
  contentType: string
  pathname: string
  url: string
}

export async function uploadFile(
  file: File,
  isUploadToGoogleDrive: boolean = true,
) {
  const fileHash = await calculateSHA256FromFile(file)

  const res = await fetch(`/api/upload?fileHash=${fileHash}`, {
    method: 'POST',
    body: file,
  }).then((res) => res.json())

  if (isUploadToGoogleDrive) {
    uploadToGoogleDrive(fileHash, file)
  }

  return res as UploadReturn
}
