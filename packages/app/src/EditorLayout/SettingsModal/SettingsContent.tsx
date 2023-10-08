import { Box } from '@fower/react'
import { useModalContext } from 'uikit'
import { useExtensionStore } from '@penx/hooks'
import { ExtensionSettingsForm } from './ExtensionSettingsForm'

export const SettingsContent = () => {
  const { data } = useModalContext<string>()
  const { extensionStore } = useExtensionStore()

  return (
    <Box column flex-1 py8 px10>
      {Object.keys(extensionStore.store).map((key) => {
        if (!extensionStore.store[key]?.settingsSchema?.length) {
          return null
        }

        if (data !== key) return null

        return (
          <ExtensionSettingsForm
            key={key}
            extensionId={key}
            schema={extensionStore.store[data].settingsSchema}
          />
        )
      })}
    </Box>
  )
}
