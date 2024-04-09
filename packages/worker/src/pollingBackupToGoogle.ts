import { isProd } from '@penx/constants'
import { GoogleDrive } from '@penx/google-drive'
import { db } from '@penx/local-db'
import { encryptByPublicKey } from '@penx/mnemonic'
import { User } from '@penx/model'
import { sleep } from '@penx/shared'
import { getActiveSpaceId, getAuthorizedUser } from '@penx/storage'

const INTERVAL = isProd ? 10 * 60 * 1000 : 10 * 1000

export async function pollingBackupToGoogle() {
  while (true) {
    const data = await getAuthorizedUser()

    if (data) {
      await sync()
    }

    await sleep(INTERVAL)
  }
}

async function sync() {
  // console.log('push to github...........')
  try {
    const data = await getAuthorizedUser()
    if (!data) return

    const user = new User(data)

    if (!user.google.access_token) return
    const activeSpaceId = await getActiveSpaceId()

    const spaces = await db.listSpaces()

    const activeSpace = spaces.find((s) => s.id === activeSpaceId)

    if (!activeSpace) return
    const nodes = await db.listNodesBySpaceId(activeSpace.id)

    if (!nodes.length) return

    const drive = new GoogleDrive(user.google.access_token)

    const folderName = 'PenX_backup'

    let parentId = ''
    let folders = await drive.listByName(folderName)

    if (!folders.length) {
      const folder = await drive.createFolder(folderName)
      parentId = folder.id
    } else {
      parentId = folders[0].id
    }

    const fileName = `space_${activeSpaceId}.json`

    let files = await drive.listByName(fileName)

    const publicKey = user.publicKey
    const encryptedNodes = nodes.map((node) => ({
      ...node,
      element: encryptByPublicKey(JSON.stringify(node.element), publicKey),
      props: encryptByPublicKey(JSON.stringify(node.props), publicKey),
    }))

    const spaceData = {
      space: activeSpace,
      nodes: encryptedNodes,
    }
    if (files.length) {
      await drive.updateJsonContent(files[0].id, spaceData)
    } else {
      await drive.createJSON(fileName, data, parentId)
    }

    console.log('pollingBackupToGoogle...........123')
  } catch (error) {
    console.log('backup to google drive error========', error)
  }
}
