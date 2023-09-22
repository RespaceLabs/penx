import {
  AdjustmentsHorizontalOutline,
  ArrowPathOutline,
  EyeOutline,
  InformationCircleOutline,
  TvOutline,
} from '@bone-ui/icons'
import { Box, FowerHTMLProps, styled } from '@fower/react'
import { Avatar, AvatarFallback, useModalContext } from 'uikit'
import { SettingsType } from '@penx/constants'
import { useSpaces } from '@penx/hooks'

const Title = styled('div', ['gray400', 'mb4', 'textXS', 'uppercase'])

interface SidebarItemProps extends FowerHTMLProps<'div'> {
  type: any
}

function SidebarItem({ type = SettingsType.SYNC, ...rest }: SidebarItemProps) {
  const { data = SettingsType.SYNC, setData } = useModalContext<string>()
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
          <SidebarItem type={SettingsType.SYNC}>
            <ArrowPathOutline size={20} />
            <Box>Sync</Box>
          </SidebarItem>

          <SidebarItem type={SettingsType.APPEARANCE}>
            <EyeOutline size={20} />
            <Box>Appearance</Box>
          </SidebarItem>

          <SidebarItem type={SettingsType.PREFERENCES}>
            <AdjustmentsHorizontalOutline size={20} />
            <Box>Preferences</Box>
          </SidebarItem>

          <SidebarItem type={SettingsType.HOTKEYS}>
            <TvOutline size={20} />
            <Box>Hotkeys</Box>
          </SidebarItem>

          <SidebarItem type={SettingsType.ABOUT}>
            <InformationCircleOutline size={20} />
            <Box>About</Box>
          </SidebarItem>
        </Box>
      </Box>

      <Box py4>
        <Title>Plugin</Title>
        <Box column gap2>
          <SidebarItem type={'a'}>
            <Box>Heading</Box>
          </SidebarItem>

          <SidebarItem type={'b'}>
            <Box>Calendar</Box>
          </SidebarItem>

          <SidebarItem type={'c'}>
            <Box>Agenda</Box>
          </SidebarItem>
        </Box>
      </Box>
    </Box>
  )
}
