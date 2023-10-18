import { User as IUser } from '@prisma/client'

export class User {
  constructor(public raw: IUser) {}

  get address() {
    return this.raw.address
  }

  get ghConnectionInfo() {
    return JSON.parse(this.raw.ghConnectionInfo || '{}')
  }

  getRepoName(spaceId: string) {
    return this.ghConnectionInfo[spaceId]?.repoName
  }
}
