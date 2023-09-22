import { ChangeType, ISpace } from '@penx/local-db'

export class Settings {
  constructor(private raw = {} as ISpace['settings']) {}

  get githubToken() {
    return this.raw?.sync?.githubToken || ''
  }

  get repo() {
    return this.raw?.sync?.repo || ''
  }

  get repoOwner() {
    return this.repo.split('/')[0]
  }

  get repoName() {
    return this.repo.split('/')[1]
  }
}
