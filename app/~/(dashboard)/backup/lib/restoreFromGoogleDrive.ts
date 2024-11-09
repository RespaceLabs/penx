import { GOOGLE_DRIVE_FOLDER } from '@/lib/constants'
import { GoogleDrive } from '@/lib/google-drive'
import { db } from '@/lib/local-db'
import { INode } from '@/lib/model'
import { store } from '@/store'

export async function restoreFromGoogleDrive(
  token: string,
  userId: string,
): Promise<void> {
  if (!token) return
  const drive = new GoogleDrive(token)
  const baseFolderId = await drive.getOrCreateFolder(GOOGLE_DRIVE_FOLDER)
  const fileName = `nodes-user-${userId}.json`

  const remoteNodes: INode[] = await drive.getFileInFolder(
    baseFolderId,
    fileName,
  )
  if (!remoteNodes?.length) throw new Error('No backup file found')

  await db.deleteNodeByUserId()
  for (const node of remoteNodes) {
    await db.createNode(node as INode)
  }

  const nodes = await db.listNodesByUserId()
  store.node.setNodes(nodes)
}
