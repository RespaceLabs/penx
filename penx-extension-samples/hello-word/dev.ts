import * as tsup from 'tsup'
import { devServer } from '@penx/extension-dev-server'

tsup.build({
  entry: ['main.ts'],
  format: 'esm',
  watch: true,
  async onSuccess() {
    devServer.handleBuildSuccess()
  },
})

devServer.run()
