import * as tsup from 'tsup'
import { devServer } from '@penx/extension-dev-server'

tsup.build({
  entry: ['src/main.ts'],
  format: 'cjs',
  watch: true,
  ignoreWatch: ['dist'],
  // async onSuccess() {
  //   devServer.handleBuildSuccess()
  // },
})

devServer.run()
