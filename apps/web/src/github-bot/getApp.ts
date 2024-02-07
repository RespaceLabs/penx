import { Octokit } from 'octokit'
import { getTokenByInstallationId } from './getTokenByInstallationId'

export async function getApp() {
  const installationId = Number(process.env.GITHUB_BOT_INSTALLATION_ID)
  const token = await getTokenByInstallationId(installationId)
  const app = new Octokit({ auth: token })
  return app
}
