import { Box } from '@fower/react'
import { appLoader, useLoaderStatus } from '@penx/loader'
import { StoreProvider } from '@penx/store'
import { AppProvider } from './AppProvider'
import { initFower } from './common'
import { ClientOnly } from './components/ClientOnly'
import { HotkeyBinding } from './HotkeyBinding'
import { Workbench } from './Workbench/Workbench'

initFower()
appLoader.init()

export function NewTabApp() {
  const { isLoaded } = useLoaderStatus()
  console.log('=======isLoaded:', isLoaded)

  if (!isLoaded) {
    return null
  }

  return (
    <StoreProvider>
      <Box>
        <HotkeyBinding />
        <AppProvider>
          <Workbench />
        </AppProvider>
      </Box>
    </StoreProvider>
  )
}
