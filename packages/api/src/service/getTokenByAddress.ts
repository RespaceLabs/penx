import { createAppAuth } from '@octokit/auth-app'
import { prisma } from '@penx/db'
import { User } from '@penx/model'

const privateKey = JSON.parse(process.env.GITHUB_PRIVATE_KEY || '{}').key

/**
 * Get Octokit auth token
 * @param address
 */
export async function getTokenByAddress(address: string) {
  const userRaw = await prisma.user.findUniqueOrThrow({
    where: { address },
  })

  const user = new User(userRaw)

  const auth = createAppAuth({
    appId: process.env.GITHUB_APP_ID!,
    privateKey,
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
  })

  const installationAuthentication = await auth({
    type: 'installation',
    installationId: user.github.installationId,
  })
  return installationAuthentication.token
}
