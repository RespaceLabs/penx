import { ISpace } from '@penx/model-types'

export class Settings {
  syncExtensionId = 'github-sync'

  constructor(private raw = {} as ISpace['settings']) {}
}
