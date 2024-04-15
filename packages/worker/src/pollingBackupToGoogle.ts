import { isMobile } from 'react-device-detect'
import { format } from 'date-fns'
import { HTTPError } from 'ky'
import { GOOGLE_DRIVE_FOLDER_NAME, isProd } from '@penx/constants'
import { calculateSHA256FromString } from '@penx/encryption'
import { GoogleDrive } from '@penx/google-drive'
import { db } from '@penx/local-db'
import { encryptByPublicKey } from '@penx/mnemonic'
import { User } from '@penx/model'
import { getConnectionState, sleep } from '@penx/shared'
import {
  getActiveSpaceId,
  getAuthorizedUser,
  setAuthorizedUser,
} from '@penx/storage'
import { api } from '@penx/trpc-client'

const INTERVAL = isProd ? 30 * 60 * 1000 : 10 * 1000

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
  console.log('pollingBackupToGoogle...........')
  // console.log('con==============', con, 'isMobile:', isMobile)

  const con = getConnectionState()

  // TODO:
  if (isMobile) return

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

    const userId = user.id
    const folderName = `${GOOGLE_DRIVE_FOLDER_NAME}-${userId}`
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const dateFolderName = `space_${activeSpaceId}_${todayStr}`

    const drive = new GoogleDrive(user.google.access_token)

    const getOrCreateTodayFolder = async (baseFolderId: string) => {
      const files = await drive.listFileInFolder(baseFolderId, dateFolderName)
      if (!files.length) {
        const folder = await drive.createFolder(dateFolderName, baseFolderId)
        return folder.id
      }
      // console.log('=======files:', files)
      return files[0].id
    }

    const baseFolderId = await drive.getOrCreateFolder(folderName)
    const dateFolderId = await getOrCreateTodayFolder(baseFolderId)

    // console.log('=======dateParentId:', dateParentId)

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

    const time = new Date().toISOString()
    const hash = calculateSHA256FromString(JSON.stringify(nodes))
    // console.log('nodes=========:', nodes, 'hash:', hash)

    let files = await drive.searchFilesByPath(dateFolderId, hash)

    console.log('===========files:', files)

    const fileName = `${hash}_${time}.json`
    if (!files.length) {
      await drive.createJSON(fileName, spaceData, dateFolderId)
    } else {
      await drive.updateJsonContent(files[0].id, spaceData)
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.response.status === 401) {
        console.log('401=======error:', error)
        const token = await api.google.googleDriveToken.query()
        const data = await getAuthorizedUser()

        await setAuthorizedUser({
          ...data,
          google: token,
        })
        return
      }
    }
    console.log('backup to google drive error========', error)
  }
}
