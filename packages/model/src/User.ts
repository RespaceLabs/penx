import { User as IUser } from '@prisma/client'
import { RoleType } from '@penx/constants'

export type GithubInfo = {
  installationId: number
  repo: string
  token: string
  refreshToken: string
  tokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export type GoogleInfo = {
  access_token: string
  scope: string
  token_type: string
  expiry_date: number
  refresh_token: string

  id: string
  email: string
  picture: string
}

export class User {
  constructor(public raw: IUser) {}

  get id() {
    return this.raw?.id as string
  }

  get username() {
    return (
      this.raw?.name ||
      this.raw.username ||
      this.address?.slice(0, 6) + '...' + this.address.slice(-3)
    )
  }

  get publicKey() {
    return this.raw?.publicKey as string
  }

  get address() {
    return this.raw.address || ''
  }

  get github(): GithubInfo {
    if (typeof this.raw.github === 'string') {
      return JSON.parse(this.raw.github || '{}')
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

  get google(): GoogleInfo {
    if (typeof this.raw.google === 'string') {
      return JSON.parse(this.raw.google || '{}')
    }
    return (this.raw.google || {}) as GoogleInfo
  }

  get isSyncWorks() {
    return !!this.repo
  }

  get isMnemonicBackedUp() {
    return this.raw.isMnemonicBackedUp
  }

  get isAdmin() {
    return this.raw.roleType === RoleType.ADMIN
  }
}
