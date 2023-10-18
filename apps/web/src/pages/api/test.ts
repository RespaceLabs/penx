import { createAppAuth } from '@octokit/auth-app'
import MarkdownIt from 'markdown-it'
import { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from 'octokit'
import { prisma } from '@penx/db'
import { slateToMarkdown } from '@penx/serializer'

const privateKey = JSON.parse(process.env.GITHUB_PRIVATE_KEY || '{}').key

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('=========privateKey:', privateKey)

  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey,
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
  })

  const installationAuthentication = await auth({
    type: 'installation',
    installationId: 41369571,
  })
  res.json({
    privateKey,
    installationAuthentication,
    ok: true,
  })
}
