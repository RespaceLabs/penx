import { User as IUser } from '@prisma/client'

type GhConnectionInfo = Record<
  string,
  {
    repoName: string
    installationId: number
  }
>

export class User {
  constructor(public raw: IUser) {}

  get address() {
    return this.raw.address
  }

  get ghConnectionInfo(): GhConnectionInfo {
    return JSON.parse(this.raw.ghConnectionInfo || '{}')
  }

  getSpace(spaceId: string) {
    return this.ghConnectionInfo[spaceId]!
  }

  getRepoName(spaceId: string) {
    return this.ghConnectionInfo[spaceId]?.repoName
  }

  getInstallationId(spaceId: string) {
    return this.ghConnectionInfo[spaceId]?.installationId
  }
}
