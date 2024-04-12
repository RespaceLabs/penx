import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { SyncServerType } from '@penx/constants'
import { prisma, SyncServer, User } from '@penx/db'

type Me = User & {
  syncServerAccessToken: string
  syncServerUrl: string
  token?: string
}

export async function getMe(userId: string, needToken = false) {
  // const redisKey = RedisKeys.user(ctx.token.uid)

  // const userStr = await redis.get(redisKey)

  // if (userStr) {
  //   return JSON.parse(userStr) as User
  // }

  let user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) new TRPCError({ code: 'NOT_FOUND' })

  // No sync server in this user, create it
  if (!user?.connectedSyncServerId) {
    const syncServer = await prisma.syncServer.findFirst({
      where: {
        type: SyncServerType.OFFICIAL,
        url: { not: '' },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (syncServer) {
      user = await prisma.user.update({
        where: { id: userId },
        data: { connectedSyncServerId: syncServer.id },
      })
    }

    const syncServerAccessToken = jwt.sign(
      { sub: userId },
      syncServer?.token as string,
    )

    return {
      ...user,
      syncServerAccessToken,
      syncServerUrl: syncServer?.url as string,
      ...generateToken(userId, needToken),
    } as Me
  } else {
    const syncServer = await prisma.syncServer.findUnique({
      where: { id: user.connectedSyncServerId },
    })

    const syncServerAccessToken = jwt.sign(
      { sub: userId },
      syncServer?.token as string,
    )
    return {
      ...user,
      syncServerAccessToken,
      syncServerUrl: syncServer?.url as string,
      ...generateToken(userId, needToken),
    } as Me
  }

  // await redis.set(redisKey, JSON.stringify(user))
}

function generateToken(userId: string, needToken = false) {
  if (!needToken) return {}

  return {
    token: jwt.sign({ sub: userId }, process.env.NEXTAUTH_SECRET!, {
      expiresIn: '365d',
    }),
  }
}
