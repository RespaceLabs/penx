import { GOOGLE_DRIVE_FOLDER } from '@/lib/constants'
import { GoogleDrive } from '@/lib/google-drive'
import { db } from '@/lib/local-db'

export async function syncToGoogleDrive(
  token: string,
  userId: string,
): Promise<void> {
  if (!token) return
  const drive = new GoogleDrive(token)
  const baseFolderId = await drive.getOrCreateFolder(GOOGLE_DRIVE_FOLDER)
  const fileName = `nodes-user-${userId}.json`
  let files = await drive.searchFilesByPath(baseFolderId, fileName)

  const nodes = await db.listNodesByUserId()

  if (!files.length) {
    await drive.createJSON(fileName, nodes, baseFolderId)
  } else {
    await drive.updateJsonContent(files[0].id, nodes)
  }
}
