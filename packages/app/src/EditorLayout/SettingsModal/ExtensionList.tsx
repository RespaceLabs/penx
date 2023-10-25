import { Box, FowerHTMLProps, styled } from '@fower/react'
import { useModalContext } from 'uikit'
import { SettingsType } from '@penx/constants'
import { useExtensionStore } from '@penx/hooks'

const Title = styled('div', ['gray400', 'mb4', 'textXS', 'uppercase'])

interface SidebarItemProps extends FowerHTMLProps<'div'> {
  type: any
}

function SidebarItem({
  type = SettingsType.PREFERENCES,
  ...rest
}: SidebarItemProps) {
  const { data = SettingsType.PREFERENCES, setData } = useModalContext<string>()
  return (
    <Box
      toCenterY
      gapX2
      gray600
      textSM
      cursorPointer
      roundedXL
      py-8
      px3
      mx--12
      bgGray200--hover
      bgGray200={type === data}
      {...rest}
      onClick={() => {
        setData(type)
      }}
    />
  )
}

export const ExtensionList = () => {
  const { extensionStore } = useExtensionStore()

  return (
    <Box py4>
      <Title>Plugin</Title>
      <Box column gap2>
        {Object.keys(extensionStore.store).map((key) => {
          if (!extensionStore.store[key]?.settingsSchema?.length) {
            return null
          }

          return (
            <SidebarItem key={key} type={key}>
              <Box>{key}</Box>
            </SidebarItem>
          )
        })}
      </Box>
    </Box>
  )
}
