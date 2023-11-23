import { OAuthApp } from '@octokit/oauth-app'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@penx/db'
import { GithubInfo } from '@penx/model'

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

  const userId = req.query.state as string

  console.log('token=========authentication:', userId, authentication)

  await prisma.user.update({
    where: { id: userId },
    data: {
      github: {
        token: authentication.token,
        refreshToken: (authentication as any).refreshToken,
        tokenExpiresAt: (authentication as any).expiresAt,
        refreshTokenExpiresAt: (authentication as any).refreshTokenExpiresAt,
      } as GithubInfo,
    },
  })

  // https://github.com/login/oauth/access_token
  // res.redirect(`/spaces/${spaceId}/git`)
  res.redirect(`/`)
}
