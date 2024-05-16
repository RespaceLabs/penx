import { createAppAuth } from '@octokit/auth-app'

export async function getTokenByInstallationId(installationId: number) {
  const privateKey = JSON.parse(process.env.GITHUB_BOT_PRIVATE_KEY || '{}').key

  const auth = createAppAuth({
    appId: process.env.GITHUB_BOT_APP_ID!,
    privateKey,
    clientId: process.env.GITHUB_BOT_CLIENT_ID!,
    clientSecret: process.env.GITHUB_BOT_CLIENT_SECRET!,
  })

  const installationAuthentication = await auth({
    type: 'installation',
    installationId,
  })

  return installationAuthentication.token
}
