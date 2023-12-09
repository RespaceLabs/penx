import './globals.css'

import { EditorApp, initFower } from '@penx/app'
import { SessionProvider } from '@penx/hooks'

initFower()

function IndexNewtab() {
  return (
    <div>
      <SessionProvider value={null}>
        <EditorApp />
      </SessionProvider>
    </div>
  )
}

export default IndexNewtab
