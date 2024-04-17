import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { prisma, User } from '@penx/db'

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

  let syncServerAccessToken = ''
  let syncServerUrl = ''

  if (user?.connectedSyncServerId) {
    const syncServer = await prisma.syncServer.findUnique({
      where: { id: user?.connectedSyncServerId as string },
    })

    if (syncServer) {
      syncServerAccessToken = jwt.sign(
        { sub: userId },
        syncServer?.token as string,
      )
      syncServerUrl = syncServer?.url as string
    }
  }

  return {
    ...user,
    syncServerAccessToken,
    syncServerUrl,
    ...generateToken(userId, needToken),
  } as Me

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
