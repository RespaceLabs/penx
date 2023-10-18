import { createAppAuth } from '@octokit/auth-app'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@penx/db'
import { User } from '@penx/model'

const privateKey = JSON.parse(process.env.GITHUB_PRIVATE_KEY || '{}').key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const spaceId = (req.query.spaceId as string) || ''
    const address = (req.query.address as string) || ''
    console.log('address:', address)

    const userRaw = await prisma.user.findUniqueOrThrow({
      where: { address },
    })

    const user = new User(userRaw)
    const space = user.getSpace(spaceId)
    console.log('user:', space)

    const auth = createAppAuth({
      appId: process.env.GITHUB_APP_ID!,
      privateKey,
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
    })

    const installationAuthentication = await auth({
      type: 'installation',
      installationId: space.installationId,
    })
    res.json({
      ok: true,
      data: {
        token: installationAuthentication.token,
      },
    })
  } catch (error) {
    res.json({ ok: false, error })
  }
}
