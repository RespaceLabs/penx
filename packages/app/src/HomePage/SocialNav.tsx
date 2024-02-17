import { ReactNode } from 'react'
import { Box } from '@fower/react'
import { ExternalLink } from 'lucide-react'
import { IconDiscord, IconGitHub, IconTwitter } from '@penx/icons'
import { StyledLink } from '../components/StyledLink'

type NavItem = {
  text?: ReactNode
  icon?: ReactNode
  to: string
  isExternal?: boolean
}

export const SocialNav = () => {
  const navData: NavItem[] = [
    {
      icon: <IconDiscord black />,
      to: 'https://discord.gg/nyVpH9njDu',
      isExternal: true,
    },
    {
      icon: <IconTwitter fillBlack />,
      to: 'https://twitter.com/0xzion_eth',
      isExternal: true,
    },
    {
      icon: <IconGitHub black />,
      to: 'https://github.com/penxio/penx',
      isExternal: true,
    },
  ]

  return (
    <Box listNone toCenterY gap6 textBase display={['none', 'flex']}>
      {navData.map((item, i) => {
        if (item.isExternal) {
          return (
            <Box key={i}>
              <Box
                as="a"
                href={item.to}
                target="_blank"
                cursorPointer
                gray600
                toCenterY
                gap1
                brand500--hover
                noUnderline
                transitionCommon
              >
                {item.text && <Box>{item.text}</Box>}
                {!!item.icon && item.icon}
                {/* <Box inlineFlex>
                  <ExternalLink size={16}></ExternalLink>
                </Box> */}
              </Box>
            </Box>
          )
        }

        return (
          <Box key={i}>
            <StyledLink href={item.to} gray600 brand500--hover transitionCommon>
              {item.text}
            </StyledLink>
          </Box>
        )
      })}
    </Box>
  )
}
