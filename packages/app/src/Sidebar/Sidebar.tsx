import { PropsWithChildren } from 'react'
import { Cog6ToothSolid, HomeSolid, UsersSolid } from '@bone-ui/icons'
import { Box } from '@fower/react'
import { useSpaces } from '@penx/hooks'
import {
  IconGitHubOutline,
  IconHome,
  IconSettings,
  IconStar,
} from '@penx/icons'
import { CatalogueBox } from '../EditorLayout/Catalogue/CatalogueBox'
import { CurrentSpace } from '../EditorLayout/CurrentSpace'

function Item({ name, children }: PropsWithChildren<{ name: string }>) {
  return (
    <Box toCenterY gap2 rounded px2 py2 gray600 textSM>
      {children}
    </Box>
  )
}

export const Sidebar = () => {
  return (
    <Box column borderRight borderGray100 flex-1>
      <CurrentSpace />

      <Box flex-1 gray600 px3 py4>
        <Item name="overview">
          <IconHome size={18} gray500 />
          <Box>Overview</Box>
        </Item>

        <Item name="git">
          <IconGitHubOutline size={20} gray500 />
          <Box>GitHub Sync</Box>
        </Item>

        <Item name="git">
          <IconStar size={20} gray500 />
          <Box>Star</Box>
        </Item>

        <Item name="settings">
          <IconSettings size={20} gray500 />
          <Box>Settings</Box>
        </Item>

        {/* <Item name="members">
          <UsersSolid size={20} gray500 />
          <Box>Members</Box>
        </Item> */}

        <CatalogueBox />
      </Box>
      {/* <Box toCenter pb8>
        <Button
          as="a"
          href={`/spaces/${spaceId}/pages/${space?.homePageId}/design`}
          variant="outline"
          roundedFull
          onClick={(e) => {
            e.preventDefault()
            push(`/spaces/${spaceId}/pages/${space?.homePageId}/design`)
          }}
        >
          Design space
        </Button>
      </Box> */}
    </Box>
  )
}
