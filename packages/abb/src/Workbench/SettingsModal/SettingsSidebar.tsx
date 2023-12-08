import { Box, FowerHTMLProps, styled } from '@fower/react'
import { Eye, Info, Option, SlidersHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, useModalContext } from 'uikit'
import { SettingsType } from '@penx/constants'
import { useSpaces } from '@penx/hooks'
import { ExtensionList } from './ExtensionList'

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

export const SettingsSidebar = () => {
  const { activeSpace } = useSpaces()
  const { data, setData } = useModalContext<string>()

  return (
    <Box w-260 bgGray100 p6>
      <Box toCenterY gap2 bgGray200 rounded3XL p3>
        <Avatar>
          <AvatarFallback>{activeSpace.name}</AvatarFallback>
        </Avatar>
        <Box textXL fontBold>
          {activeSpace.name}
        </Box>
      </Box>
      <Box py4>
        <Title>Space</Title>
        <Box column gap-1>
          <SidebarItem type={SettingsType.APPEARANCE}>
            <Eye size={20} />
            <Box>Appearance</Box>
          </SidebarItem>

          <SidebarItem type={SettingsType.PREFERENCES}>
            <SlidersHorizontal size={20} />
            <Box>Preferences</Box>
          </SidebarItem>

          <SidebarItem type={SettingsType.HOTKEYS}>
            <Option size={20} />
            <Box>Hotkeys</Box>
          </SidebarItem>

          <SidebarItem type={SettingsType.ABOUT}>
            <Info size={20} />
            <Box>About</Box>
          </SidebarItem>
        </Box>
      </Box>

      <ExtensionList />
    </Box>
  )
}
