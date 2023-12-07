import { User as IUser } from '@prisma/client'

export type GithubInfo = {
  installationId: number
  repo: string
  token: string
  refreshToken: string
  tokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export class User {
  constructor(public raw: IUser) {}

  get id() {
    return this.raw?.id as string
  }

  get address() {
    return this.raw.address
  }

  get github(): GithubInfo {
    if (typeof this.raw.github === 'string') {
      return JSON.parse(this.raw.github)
    }
    return (this.raw.github || {}) as GithubInfo
  }

  get repo() {
    return this.github.repo
  }

  get repoOwner() {
    return this.repo.split('/')[0]
  }

  get repoName() {
    return this.repo.split('/')[1]
  }

  get installationId() {
    return this.github.installationId
  }

  get isSyncWorks() {
    return !!this.repo
  }
}
