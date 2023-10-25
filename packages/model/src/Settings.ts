import { ISpace } from '@penx/types'

export class Settings {
  syncExtensionId = 'github-sync'

  constructor(private raw = {} as ISpace['settings']) {}
}
