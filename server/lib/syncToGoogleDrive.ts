import { GoogleDrive } from '@/lib/google-drive'
import { prisma } from '@/lib/prisma'
import { GoogleInfo } from '@/lib/types'
import { Post, Site, User } from '@prisma/client'
import { google } from 'googleapis'

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!

const folderName = `plantree-${process.env.NEXT_PUBLIC_SPACE_ID}`

export async function syncToGoogleDrive(
  userId: string,
  post: Post,
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return
  const token = await getAccessToken(user)
  if (!token) return
  console.log('====token:', token)
  const drive = new GoogleDrive(token)

  const baseFolderId = await drive.getOrCreateFolder(folderName)

  const fileName = `post-${post.id}.json`

  let files = await drive.searchFilesByPath(baseFolderId, fileName)
  if (!files.length) {
    await drive.createJSON(fileName, post, baseFolderId)
  } else {
    await drive.updateJsonContent(files[0].id, post)
  }

  console.log('======baseFolderId:', baseFolderId)
}

async function getAccessToken(user: User) {
  const googleInfo = user.google as GoogleInfo
  // console.log('========googleInfo:', googleInfo)
  const isExpired = googleInfo.expiry_date < Date.now()
  console.log('======isExpired:', isExpired)

  if (!isExpired) {
    return googleInfo.access_token
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret)
  oauth2Client.setCredentials({
    refresh_token: googleInfo.refresh_token,
  })

  const accessToken = await oauth2Client.getAccessToken()

  if (accessToken.token && accessToken.res?.data) {
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    })

    const userInfo = await oauth2.userinfo.get()
    const newData = {
      ...accessToken.res?.data,
      ...userInfo.data,
    } as GoogleInfo

    await prisma.user.update({
      where: { id: user.id },
      data: { google: newData },
    })
  }

  return accessToken.token as string
}
