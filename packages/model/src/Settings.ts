import { ISpace } from '@penx/types'

export class Settings {
  syncExtensionId = 'github-sync'

  constructor(private raw = {} as ISpace['settings']) {}

  get githubToken() {
    return this.raw?.extensions?.[this.syncExtensionId]?.githubToken || ''
  }

  get repo() {
    return this.raw?.extensions?.[this.syncExtensionId]?.repo || ''
  }

  get repoOwner() {
    return this.repo.split('/')[0]
  }

  get repoName() {
    return this.repo.split('/')[1]
  }
}
