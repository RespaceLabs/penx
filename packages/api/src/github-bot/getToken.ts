import { getTokenByInstallationId } from './getTokenByInstallationId'

export async function getToken() {
  const installationId = Number(process.env.GITHUB_BOT_INSTALLATION_ID)
  const token = await getTokenByInstallationId(installationId)
  return token
}
