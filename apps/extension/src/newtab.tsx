import './globals.css'

import { Box } from '@fower/react'

import { NewTabApp } from '@penx/abb'
import { EditorApp } from '@penx/app'
import { SessionProvider } from '@penx/hooks'

function IndexNewtab() {
  return (
    <div>
      <SessionProvider value={null}>
        <EditorApp />
        {/* <NewTabApp /> */}
      </SessionProvider>
    </div>
  )
}

export default IndexNewtab
