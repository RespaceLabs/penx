import { OAuthApp } from '@octokit/oauth-app'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@penx/db'

const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!
const clientSecret = process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET!

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const code = req.query.code as string

  console.log('github auth code----------', code)

  const app = new OAuthApp({
    clientType: 'github-app',
    clientId,
    clientSecret,
  })

  const { authentication } = await app.createToken({
    code,
  })

  const address = req.query.state as string

  console.log('token=========authentication:', address, authentication)

  await prisma.user.update({
    where: { address },
    data: {
      ghToken: authentication.token,
      ghRefreshToken: (authentication as any).refreshToken,
      ghTokenExpiresAt: (authentication as any).expiresAt,
      ghRefreshTokenExpiresAt: (authentication as any).refreshTokenExpiresAt,
    },
  })

  // https://github.com/login/oauth/access_token
  // res.redirect(`/spaces/${spaceId}/git`)
  res.redirect(`/`)
}
