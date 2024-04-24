import { OAuthApp } from '@octokit/oauth-app'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { Octokit } from 'octokit'
import { prisma } from '@penx/db'
import { GithubInfo } from '@penx/model'

const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!
const clientSecret = process.env.GITHUB_CLIENT_SECRET!

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

  const oct = new Octokit({ auth: authentication.token })

  const user = await oct.request('GET /user', {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  // console.log('token=========authentication:', userId, authentication)

  await prisma.user.update({
    where: { id: userId },
    data: {
      taskGithub: {
        accountId: user.data.id,
        login: user.data.login,
        token: authentication.token,
        refreshToken: (authentication as any).refreshToken,
        tokenExpiresAt: (authentication as any).expiresAt,
        refreshTokenExpiresAt: (authentication as any).refreshTokenExpiresAt,
      },
    },
  })

  res.redirect(`/tasks`)
}
